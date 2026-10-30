// Modèle en mémoire du wiki : dossiers et pages construits à partir de l'arborescence lue sur disque.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { parseFrontmatter } from './frontmatter.js';

export const store = {
  root: null,
  pages: new Map(),
  folders: new Map(),
};

const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

export function prettify(name) {
  const s = name
    .replace(/\.md$/i, '')
    .replace(/^\d+[-_. ]+/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return s ? s[0].toUpperCase() + s.slice(1) : name;
}

function firstHeading(body) {
  const m = /^#\s+(.+)$/m.exec(body);
  return m ? m[1].trim() : null;
}

function normTags(t) {
  if (!t) return [];
  const arr = Array.isArray(t) ? t : String(t).split(',');
  return arr.map((x) => String(x).trim()).filter(Boolean);
}

function sortNodes(a, b) {
  const oa = a.order ?? null;
  const ob = b.order ?? null;
  if (oa !== null || ob !== null) {
    if (oa === null) return 1;
    if (ob === null) return -1;
    if (oa !== ob) return oa - ob;
  }
  if (a.type !== b.type) return a.type === 'page' ? -1 : 1;
  return collator.compare(a.name, b.name);
}

export function makePage(node, parent) {
  const { data, body } = parseFrontmatter(node.raw);
  return {
    type: 'page',
    path: node.path,
    name: node.name,
    raw: node.raw,
    fm: data,
    body,
    parent,
    mtime: node.mtime,
    title: String(data.title || firstHeading(body) || prettify(node.name)),
    description: String(data.description || ''),
    tags: normTags(data.tags),
    icon: data.icon ? String(data.icon) : null,
    order: typeof data.order === 'number' ? data.order : null,
  };
}

export function buildStore(tree) {
  store.pages.clear();
  store.folders.clear();
  const walk = (node, parent) => {
    if (node.type === 'page') {
      const p = makePage(node, parent);
      store.pages.set(p.path, p);
      return p;
    }
    const meta = node.meta || {};
    const f = {
      type: 'folder',
      path: node.path,
      name: node.name,
      meta,
      parent,
      title: meta.title || (node.path ? prettify(node.name) : 'Wiki'),
      description: meta.description || '',
      icon: meta.icon || null,
      // Couleur injectée dans un attribut style : seules les notations sûres sont acceptées (contenu importé non fiable).
      color: /^(#[0-9a-f]{3,8}|[a-z]{3,20})$/i.test(String(meta.color || '')) ? meta.color : null,
      order: typeof meta.order === 'number' ? meta.order : null,
      children: [],
    };
    store.folders.set(f.path, f);
    f.children = node.children.map((c) => walk(c, f)).sort(sortNodes);
    return f;
  };
  store.root = walk(tree, null);
}

/** Ancêtres d'un nœud (hors racine), du plus haut au plus proche. */
export function ancestors(node) {
  const out = [];
  let p = node.parent;
  while (p && p.parent) {
    out.unshift(p);
    p = p.parent;
  }
  return out;
}

export function crumbText(node) {
  return ancestors(node)
    .map((a) => a.title)
    .join(' › ');
}

/** Couleur héritée du dossier le plus proche qui en définit une. */
export function tintOf(node) {
  let n = node.type === 'folder' ? node : node.parent;
  while (n) {
    if (n.color) return n.color;
    n = n.parent;
  }
  return null;
}

export function iconOf(node) {
  if (node.icon) return node.icon;
  return node.type === 'folder' ? 'folder' : 'file-text';
}

export function pagesUnder(folder) {
  const out = [];
  const walk = (f) => {
    for (const c of f.children) {
      if (c.type === 'page') out.push(c);
      else walk(c);
    }
  };
  walk(folder);
  return out;
}

export function allFolders() {
  return [...store.folders.values()];
}

export function getNode(path) {
  return store.pages.get(path) || store.folders.get(path) || null;
}

/** Résout un lien relatif (`../bind9/zones.md#soa`) depuis une page. */
export function resolveRelative(fromPage, href) {
  const [rawPath, hash] = href.split('#');
  const base = fromPage.path.split('/').slice(0, -1);
  for (const seg of decodeURIComponent(rawPath).split('/')) {
    if (seg === '..') base.pop();
    else if (seg && seg !== '.') base.push(seg);
  }
  return { path: base.join('/'), hash: hash || '' };
}

/**
 * Résout un lien wiki [[Titre]] ou [[chemin/vers/page]].
 * Un chemin est cherché d'abord à côté de la page courante, puis depuis la racine, puis n'importe où.
 */
export function resolveWikiLink(target, fromPage = null) {
  const t = target.trim().toLowerCase();
  const asPath = t.endsWith('.md') ? t : `${t}.md`;
  const byLower = new Map([...store.pages.values()].map((p) => [p.path.toLowerCase(), p]));
  if (fromPage) {
    const dir = fromPage.path.toLowerCase().split('/').slice(0, -1);
    while (true) {
      const hit = byLower.get([...dir, asPath].join('/'));
      if (hit) return hit;
      if (!dir.length) break;
      dir.pop();
    }
  }
  if (byLower.has(asPath)) return byLower.get(asPath);
  for (const [lp, p] of byLower) if (lp.endsWith('/' + asPath)) return p;
  for (const p of store.pages.values()) if (p.title.toLowerCase() === t) return p;
  for (const p of store.pages.values()) if (p.title.toLowerCase().includes(t)) return p;
  return null;
}

export function siblingsOf(page) {
  const list = page.parent ? page.parent.children.filter((c) => c.type === 'page') : [];
  const i = list.indexOf(page);
  return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null, index: i };
}

export function stats() {
  let words = 0;
  const tags = new Set();
  for (const p of store.pages.values()) {
    words += (p.body.match(/\S+/g) || []).length;
    p.tags.forEach((t) => tags.add(t.toLowerCase()));
  }
  const services = [...store.folders.values()].filter((f) => f.parent && f.parent.parent && !f.children.some((c) => c.type === 'folder')).length;
  return { pages: store.pages.size, folders: store.folders.size - 1, words, tags: tags.size, services };
}
