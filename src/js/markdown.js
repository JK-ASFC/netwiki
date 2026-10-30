// Rendu Markdown : GFM + liens wiki [[...]], encadrés > [!NOTE], blocs de code colorés, diagrammes Mermaid.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from './hl.js';
import { icon } from './icons.js';
import { esc, normalize } from './ui.js';
import { resolveRelative, resolveWikiLink, store } from './store.js';

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  extensions: [
    {
      name: 'wikilink',
      level: 'inline',
      start(src) {
        const i = src.indexOf('[[');
        return i < 0 ? undefined : i;
      },
      tokenizer(src) {
        // `\|` est accepté comme séparateur pour pouvoir écrire un lien wiki dans un tableau.
        const m = /^\[\[([^\]|\n]+?)\\?(?:\|([^\]\n]+))?\]\]/.exec(src);
        if (m) return { type: 'wikilink', raw: m[0], target: m[1].trim(), label: (m[2] || m[1]).trim() };
      },
      renderer(t) {
        return `<a class="wikilink" data-wikilink="${esc(t.target)}">${esc(t.label)}</a>`;
      },
    },
  ],
  renderer: {
    code({ text, lang }) {
      const info = (lang || '').trim();
      const [first = '', ...rest] = info.split(/\s+/);
      const language = first.toLowerCase();
      const title = rest
        .join(' ')
        .replace(/^title=/, '')
        .replace(/^["']|["']$/g, '');
      if (language === 'mermaid') return `<div class="mermaid-block"><pre class="mermaid">${esc(text)}</pre></div>`;
      const known = language && hljs.getLanguage(language);
      const body = known ? hljs.highlight(text, { language, ignoreIllegals: true }).value : esc(text);
      return (
        `<div class="code-block"><div class="code-head"><span class="dots"><i></i><i></i><i></i></span>` +
        `<span class="lang">${esc(language || 'texte')}</span>` +
        (title ? `<span class="code-title">${esc(title)}</span>` : '') +
        `<button class="code-copy" type="button">${icon('copy', 14)}<span>Copier</span></button></div>` +
        `<pre><code class="hljs">${body}</code></pre></div>`
      );
    },
  },
});

const CALLOUTS = {
  note: { cls: 'note', title: 'Note', icon: 'info' },
  info: { cls: 'note', title: 'Info', icon: 'info' },
  tip: { cls: 'tip', title: 'Astuce', icon: 'lightbulb' },
  astuce: { cls: 'tip', title: 'Astuce', icon: 'lightbulb' },
  important: { cls: 'important', title: 'Important', icon: 'message-square-warning' },
  warning: { cls: 'warning', title: 'Attention', icon: 'triangle-alert' },
  attention: { cls: 'warning', title: 'Attention', icon: 'triangle-alert' },
  caution: { cls: 'caution', title: 'Danger', icon: 'octagon-alert' },
  danger: { cls: 'caution', title: 'Danger', icon: 'octagon-alert' },
  example: { cls: 'example', title: 'Exemple', icon: 'flask-conical' },
  exemple: { cls: 'example', title: 'Exemple', icon: 'flask-conical' },
};

function slug(text) {
  return (
    normalize(text)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

function isExternal(href) {
  return /^(https?:|mailto:)/i.test(href);
}

export function assetUrl(page, src) {
  const { path } = resolveRelative(page, src);
  // Version mobile : la couche plateforme sert les images livrées avec le contenu.
  if (window.NETWIKI_ASSET_URL) return window.NETWIKI_ASSET_URL(path);
  return 'wikifile://local/' + path.split('/').map(encodeURIComponent).join('/');
}

/**
 * Transforme le Markdown d'une page en élément DOM prêt à insérer.
 * Renvoie { el, toc } où toc = [{ level, text, id }].
 */
export function renderMarkdown(body, page) {
  const html = DOMPurify.sanitize(marked.parse(body), { ADD_ATTR: ['target'], FORBID_TAGS: ['style'] });
  const el = document.createElement('div');
  el.className = 'md';
  el.innerHTML = html;
  const toc = [];

  // titres : identifiants + ancres + sommaire
  const used = new Map();
  el.querySelectorAll('h1, h2, h3, h4').forEach((hd) => {
    let id = slug(hd.textContent);
    const n = used.get(id) || 0;
    used.set(id, n + 1);
    if (n) id = `${id}-${n}`;
    hd.id = id;
    if (hd.tagName === 'H2' || hd.tagName === 'H3') toc.push({ level: hd.tagName === 'H2' ? 2 : 3, text: hd.textContent, id });
    const a = document.createElement('a');
    a.className = 'h-anchor';
    a.href = `#${id}`;
    a.textContent = '#';
    hd.prepend(a);
  });

  // encadrés GitHub / Obsidian : > [!NOTE] Titre optionnel
  el.querySelectorAll('blockquote').forEach((bq) => {
    const p = bq.firstElementChild;
    if (!p || p.tagName !== 'P') return;
    const m = /^\s*\[!([a-zA-Z]+)\][ \t]*([^\n]*)\n?/.exec(p.innerHTML);
    if (!m) return;
    const def = CALLOUTS[m[1].toLowerCase()] || CALLOUTS.note;
    p.innerHTML = p.innerHTML.slice(m[0].length);
    if (!p.innerHTML.trim()) p.remove();
    const box = document.createElement('div');
    box.className = `callout ${def.cls}`;
    box.innerHTML = `<div class="callout-title">${icon(def.icon, 17)}<span>${m[2].trim() || def.title}</span></div>`;
    box.append(...bq.childNodes);
    bq.replaceWith(box);
  });

  // liens
  el.querySelectorAll('a').forEach((a) => {
    if (a.classList.contains('h-anchor')) return;
    if (a.dataset.wikilink) {
      const target = resolveWikiLink(a.dataset.wikilink, page);
      if (target) {
        a.dataset.page = target.path;
        // [[chemin]] sans libellé : afficher le titre de la page plutôt que le nom du fichier
        if (a.textContent === a.dataset.wikilink) a.textContent = target.title;
      } else {
        a.classList.add('broken');
        a.title = 'Page introuvable';
      }
      return;
    }
    const href = a.getAttribute('href') || '';
    if (!href) return;
    if (isExternal(href)) {
      a.classList.add('external');
      a.title = href;
    } else if (href.startsWith('#')) {
      a.dataset.anchor = href.slice(1);
    } else if (page) {
      const { path, hash } = resolveRelative(page, href);
      const candidate = store.pages.has(path) ? path : store.pages.has(path + '.md') ? path + '.md' : store.folders.has(path) ? path : null;
      if (candidate) {
        a.dataset.page = candidate;
        if (hash) a.dataset.anchor = hash;
      } else {
        a.classList.add('broken');
        a.title = 'Page introuvable';
      }
    }
    a.removeAttribute('href');
    if (isExternal(href)) a.dataset.href = href;
  });

  // images relatives → protocole wikifile:// ; ![texte](image.png "Légende") → figure légendée
  el.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (page && src && !/^(https?:|data:|blob:)/i.test(src)) img.src = assetUrl(page, src);
    img.loading = 'lazy';
    img.classList.add('zoomable');
    const caption = img.getAttribute('title');
    const p = img.parentElement;
    if (caption && p?.tagName === 'P' && p.childNodes.length === 1) {
      const fig = document.createElement('figure');
      const cap = document.createElement('figcaption');
      cap.textContent = caption;
      img.removeAttribute('title');
      p.replaceWith(fig);
      fig.append(img, cap);
    }
  });

  // tableaux défilants
  el.querySelectorAll('table').forEach((t) => {
    const w = document.createElement('div');
    w.className = 'table-wrap';
    t.replaceWith(w);
    w.append(t);
  });

  el.querySelectorAll('input[type=checkbox]').forEach((c) => (c.disabled = true));

  return { el, toc };
}

/** Comportements interactifs (copie de code) à brancher une fois le contenu inséré. */
export function wireContent(root) {
  root.querySelectorAll('img.zoomable').forEach((img) => (img.onclick = () => openImage(img)));
  root.querySelectorAll('.code-copy').forEach((btn) => {
    btn.onclick = async () => {
      const code = btn.closest('.code-block').querySelector('code').innerText;
      await navigator.clipboard.writeText(code.replace(/\n$/, ''));
      btn.classList.add('done');
      btn.innerHTML = `${icon('check', 14)}<span>Copié</span>`;
      setTimeout(() => {
        btn.classList.remove('done');
        btn.innerHTML = `${icon('copy', 14)}<span>Copier</span>`;
      }, 1600);
    };
  });
  renderMermaid(root);
}

/** Affiche une image en grand (clic ou Échap pour fermer). */
function openImage(img) {
  const box = document.createElement('div');
  box.className = 'img-lightbox';
  const big = document.createElement('img');
  big.src = img.currentSrc || img.src;
  big.alt = img.alt;
  box.append(big);
  const caption = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt;
  if (caption) {
    const cap = document.createElement('div');
    cap.className = 'img-lightbox-cap';
    cap.textContent = caption;
    box.append(cap);
  }
  const close = () => {
    box.remove();
    document.removeEventListener('keydown', onKey, true);
  };
  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
    }
  };
  box.onclick = close;
  document.addEventListener('keydown', onKey, true);
  document.body.append(box);
}

// ---------------------------------------------------------------- Mermaid (chargé à la demande)

let mermaidPromise = null;
let mermaidSeq = 0;

function loadMermaid() {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  mermaidPromise ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = (window.NETWIKI_ASSET_BASE || '../dist/') + 'mermaid.min.js';
    s.onload = () => resolve(window.mermaid);
    s.onerror = reject;
    document.head.append(s);
  });
  return mermaidPromise;
}

export async function renderMermaid(root) {
  const nodes = [...root.querySelectorAll('pre.mermaid')];
  if (!nodes.length) return;
  const mermaid = await loadMermaid();
  const dark = document.documentElement.dataset.theme !== 'light';
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6366f1';
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    fontFamily: 'Inter Variable, Segoe UI, sans-serif',
    themeVariables: dark
      ? {
          darkMode: true,
          background: 'transparent',
          primaryColor: '#1e2436',
          primaryBorderColor: accent,
          primaryTextColor: '#e7e9f0',
          secondaryColor: '#16302f',
          tertiaryColor: '#2a1f36',
          lineColor: '#7c8399',
          textColor: '#e7e9f0',
          mainBkg: '#1e2436',
          nodeBorder: accent,
          clusterBkg: '#141826',
          clusterBorder: '#2c3347',
          noteBkgColor: '#2a2a1e',
          noteTextColor: '#e7e9f0',
          actorBkg: '#1e2436',
          actorBorder: accent,
          actorTextColor: '#e7e9f0',
          signalColor: '#a4aabb',
          signalTextColor: '#e7e9f0',
          labelBoxBkgColor: '#1e2436',
          edgeLabelBackground: '#161a25',
        }
      : {
          primaryColor: '#eef0ff',
          primaryBorderColor: accent,
          primaryTextColor: '#171a26',
          lineColor: '#8a91a4',
          secondaryColor: '#e6f7f7',
          tertiaryColor: '#fbefff',
          edgeLabelBackground: '#ffffff',
        },
  });
  for (const node of nodes) {
    const src = node.textContent;
    try {
      const { svg } = await mermaid.render(`mmd-${++mermaidSeq}`, src);
      const holder = document.createElement('div');
      holder.innerHTML = svg;
      node.replaceWith(holder);
    } catch (err) {
      node.insertAdjacentHTML('afterend', `<div class="mermaid-error">Diagramme invalide : ${esc(err.message || err)}</div>`);
    }
  }
}

// ---------------------------------------------------------------- surlignage des termes recherchés

export function highlightTerms(root, terms) {
  const words = terms.map(normalize).filter((t) => t.length > 1);
  if (!words.length) return [];
  const re = new RegExp(words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  const hits = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('.code-head, .h-anchor, svg') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const node of texts) {
    const original = node.nodeValue;
    const norm = normalize(original);
    if (norm.length !== original.length) continue; // caractères composés : on ignore ce nœud
    const ranges = [];
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(norm))) ranges.push([m.index, m.index + m[0].length]);
    if (!ranges.length) continue;
    const frag = document.createDocumentFragment();
    let last = 0;
    for (const [a, b] of ranges) {
      frag.append(original.slice(last, a));
      const mark = document.createElement('mark');
      mark.className = 'search-hit';
      mark.textContent = original.slice(a, b);
      frag.append(mark);
      hits.push(mark);
      last = b;
    }
    frag.append(original.slice(last));
    node.replaceWith(frag);
  }
  return hits;
}
