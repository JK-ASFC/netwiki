// Palette de recherche (Ctrl+K) : recherche instantanée des articles contenant les mots tapés,
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
// #étiquettes pour filtrer et commandes « > ».
import { icon } from '../icons.js';
import { $, debounce, esc, h } from '../ui.js';
import { crumbText, iconOf, store, tintOf } from '../store.js';
import { highlightTitle, search, snippet } from '../search.js';
import { actions, state } from '../state.js';
import { openAbout } from '../legal.js';

let open = null;

const COMMANDS = () => [
  { label: 'Nouvel article', icon: 'file-plus', kbd: 'Ctrl N', run: () => actions.newPage() },
  { label: 'Nouveau dossier', icon: 'folder-plus', run: () => actions.newFolder('') },
  { label: "Retour à l'accueil", icon: 'house', run: () => actions.navigate({ type: 'home' }) },
  { label: 'Basculer le thème clair / sombre', icon: 'sun-moon', run: () => actions.toggleTheme() },
  { label: 'Afficher / masquer le panneau latéral', icon: 'panel-left', kbd: 'Ctrl B', run: () => actions.toggleSidebar() },
  { label: 'Paramètres', icon: 'settings', kbd: 'Ctrl ,', run: () => actions.openSettings() },
  { label: 'Ouvrir le dossier des données', icon: 'folder-open', run: () => actions.openDataDir() },
  { label: 'Recharger le wiki depuis le disque', icon: 'refresh-cw', run: () => actions.reload(true) },
  { label: 'Vérifier les mises à jour', icon: 'cloud-download', run: () => actions.checkUpdates({ manual: true }) },
  { label: 'Importer un paquet de contenu', icon: 'package-open', run: () => actions.importPack() },
  { label: 'Exporter un paquet de contenu', icon: 'package', run: () => actions.exportPack() },
  { label: 'À propos, confidentialité, RGPD, licence', icon: 'info', run: () => openAbout() },
];

export function closePalette() {
  if (!open) return;
  const bd = open;
  open = null;
  bd.classList.add('closing');
  setTimeout(() => bd.remove(), 150);
}

export function openPalette(initial = '') {
  if (open) {
    const input = $('input', open);
    input.value = initial || input.value;
    input.dispatchEvent(new Event('input'));
    input.select();
    return;
  }
  let sel = 0;
  let items = [];

  const bd = h(`<div class="backdrop"><div class="palette" role="dialog">
    <div class="pal-input">${icon('search', 20)}<input placeholder="Rechercher un mot dans les articles…" spellcheck="false"><kbd>Échap</kbd></div>
    <div class="pal-results"></div>
    <div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd>naviguer</span><span><kbd>Entrée</kbd>ouvrir</span><span class="grow"></span></div>
  </div></div>`);
  open = bd;
  const input = $('input', bd);
  const results = $('.pal-results', bd);
  const foot = $('.pal-foot .grow', bd);

  const select = (i) => {
    sel = Math.max(0, Math.min(items.length - 1, i));
    results.querySelectorAll('.pal-item').forEach((el, k) => el.classList.toggle('sel', k === sel));
    results.querySelector('.pal-item.sel')?.scrollIntoView({ block: 'nearest' });
  };

  const choose = (i) => {
    const it = items[i];
    if (!it) return;
    closePalette();
    it.run();
  };

  const run = () => {
    const q = input.value.trim();
    items = [];
    let html = '';
    if (q.startsWith('>')) {
      const f = q.slice(1).trim().toLowerCase();
      const cmds = COMMANDS().filter((c) => c.label.toLowerCase().includes(f));
      html += `<div class="pal-group">Commandes</div>`;
      for (const c of cmds) {
        items.push(c);
        html += `<div class="pal-item" data-i="${items.length - 1}"><div class="pi-icon">${icon(c.icon, 17)}</div>
          <div class="pi-body"><div class="pi-title">${esc(c.label)}</div></div>${c.kbd ? `<kbd>${c.kbd}</kbd>` : ''}</div>`;
      }
      foot.textContent = `${cmds.length} commande(s)`;
    } else if (!q) {
      const recent = (state.settings.recent || []).map((p) => store.pages.get(p)).filter(Boolean).slice(0, 5);
      if (recent.length) html += `<div class="pal-group">Récemment consultés</div>`;
      for (const p of recent) {
        items.push({ run: () => actions.navigate({ type: 'page', path: p.path }) });
        html += pageItem(p, esc(p.title), '', items.length - 1);
      }
      if (!recent.length) html = `<div class="pal-empty">${icon('search', 28)}<p>Tapez un mot : les articles qui le contiennent s'affichent aussitôt.</p></div>`;
      foot.textContent = `${store.pages.size} articles · #étiquette pour filtrer · > pour les commandes`;
    } else {
      const res = search(q, { strict: true, limit: 50 });
      const words = q.replace(/#\S+/g, ' ').split(/\s+/).filter(Boolean);
      for (const r of res) {
        const terms = r.terms.length ? r.terms : words;
        items.push({ run: () => actions.navigate({ type: 'page', path: r.page.path }, { terms }) });
        html += pageItem(r.page, highlightTitle(r.page.title, terms), snippet(r.page.path, terms, 120), items.length - 1);
      }
      if (!res.length) html = `<div class="pal-empty">${icon('search-x', 28)}<p>Aucun article ne contient « ${esc(q)} »</p></div>`;
      foot.textContent = res.length >= 50 ? '50 premiers articles — précisez la recherche' : `${res.length} article(s)`;
    }
    results.innerHTML = html;
    select(0);
  };

  const runLater = debounce(run, 25);
  input.addEventListener('input', runLater);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      select(sel + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      select(sel - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(sel);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });
  results.addEventListener('mousemove', (e) => {
    const it = e.target.closest('.pal-item');
    if (it && Number(it.dataset.i) !== sel) select(Number(it.dataset.i));
  });
  results.addEventListener('click', (e) => {
    const it = e.target.closest('.pal-item');
    if (it) choose(Number(it.dataset.i));
  });
  bd.addEventListener('mousedown', (e) => {
    if (e.target === bd) closePalette();
  });

  $('#overlays').append(bd);
  input.value = initial;
  run();
  input.focus();
}

function pageItem(p, titleHtml, snip, i) {
  const tint = tintOf(p);
  return `<div class="pal-item" data-i="${i}" style="${tint ? `--tint:${tint}` : ''}">
    <div class="pi-icon">${icon(iconOf(p), 17)}</div>
    <div class="pi-body"><div class="pi-title">${titleHtml}</div><div class="pi-path">${esc(crumbText(p) || 'Racine')}</div>
    ${snip ? `<div class="pi-snip">${snip}</div>` : ''}</div>
    <span class="pi-enter">${icon('corner-down-left', 16)}</span></div>`;
}

export function isPaletteOpen() {
  return !!open;
}
