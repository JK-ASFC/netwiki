// Recherche plein texte locale (MiniSearch) : tolérante aux fautes, préfixes, insensible aux accents.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import MiniSearch from 'minisearch';
import { esc, normalize } from './ui.js';
import { ancestors, crumbText, store } from './store.js';

const STOP = new Set(
  'le la les un une des de du d l et ou en au aux a à ce ces cet cette son sa ses pour par sur dans avec sans est sont the of and to in is on for'.split(' ')
);

let index = null;
const texts = new Map();

function plain(md) {
  return md
    .replace(/```([^\n]*)\n/g, ' $1\n') // garde le langage et le titre (chemin de fichier) des blocs de code
    .replace(/```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a)
    .replace(/^>\s*\[![a-z]+\]/gim, '')
    .replace(/<\/?[a-z][^>]*>/gi, ' ') // balises HTML (diagrammes, <br/>, <kbd>)
    .replace(/[#>*_`|~]/g, ' ')
    .replace(/[ \t]+/g, ' ');
}

export function buildIndex() {
  index = new MiniSearch({
    idField: 'path',
    fields: ['title', 'tags', 'headings', 'description', 'crumbs', 'text'],
    storeFields: ['title'],
    processTerm: (term) => {
      const t = normalize(term);
      return t.length < 2 || STOP.has(t) ? null : t;
    },
    // « named.conf » ou « 192.168.1.10 » sont indexés entiers et par morceaux.
    tokenize: (s) =>
      s
        .split(/[\s\-—–,;:!?()[\]{}"'«»/\\=<>|+*`]+/u)
        .map((t) => t.replace(/^\.+|\.+$/g, ''))
        .flatMap((t) => (t.includes('.') ? [t, ...t.split('.')] : [t])),
    searchOptions: {
      boost: { title: 6, tags: 4, headings: 2.5, description: 2, crumbs: 1.5, text: 1 },
      prefix: (term) => term.length >= 2,
      fuzzy: (term) => (term.length > 5 ? 0.2 : false),
      combineWith: 'AND',
    },
  });
  texts.clear();
  const docs = [];
  for (const p of store.pages.values()) {
    const text = plain(p.body);
    texts.set(p.path, text);
    docs.push({
      path: p.path,
      title: p.title,
      tags: p.tags.join(' '),
      headings: [...p.body.matchAll(/^#{1,4}\s+(.+)$/gm)].map((m) => m[1]).join(' \n '),
      description: p.description,
      crumbs: crumbText(p),
      text,
    });
  }
  index.addAll(docs);
}

/**
 * Recherche. Syntaxe : mots libres, `#tag` pour filtrer par étiquette.
 * `scope` : chemin d'un dossier pour restreindre la recherche.
 * `strict` : uniquement les articles contenant tous les mots (début de mot, sans approximation
 * ni repli sur « au moins un mot ») — c'est le mode de la recherche instantanée.
 */
export function search(query, { scope = '', limit = 60, strict = false } = {}) {
  if (!index) buildIndex();
  const tags = [...query.matchAll(/#([\p{L}\p{N}_.-]+)/gu)].map((m) => normalize(m[1]));
  const q = query.replace(/#[\p{L}\p{N}_.-]+/gu, ' ').trim();
  const inScope = (p) => !scope || p.path.startsWith(scope + '/');
  const hasTags = (p) => tags.every((t) => p.tags.some((pt) => normalize(pt) === t));

  let results;
  if (q && strict) {
    results = index.search(q, { prefix: true, fuzzy: false, combineWith: 'AND' });
    results = results.map((r) => ({ page: store.pages.get(r.id), score: r.score, terms: r.terms }));
  } else if (q) {
    results = index.search(q);
    if (!results.length) results = index.search(q, { combineWith: 'OR' });
    results = results.map((r) => ({ page: store.pages.get(r.id), score: r.score, terms: r.terms }));
  } else if (tags.length) {
    results = [...store.pages.values()].map((page) => ({ page, score: 1, terms: [] }));
  } else return [];

  return results.filter((r) => r.page && inScope(r.page) && hasTags(r.page)).slice(0, limit);
}

/** Extrait le passage qui contient le plus de termes recherchés différents, avec surlignage. */
export function snippet(path, terms, len = 170) {
  const text = (texts.get(path) || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  const norm = normalize(text);
  const keys = [...new Set(terms.map(normalize).filter(Boolean))];
  const hits = [];
  keys.forEach((k, ki) => {
    for (let i = norm.indexOf(k); i >= 0 && hits.length < 2000; i = norm.indexOf(k, i + k.length)) hits.push([i, ki]);
  });
  hits.sort((a, b) => a[0] - b[0]);
  let pos = hits.length ? hits[0][0] : 0;
  let best = 0;
  for (let a = 0; a < hits.length; a++) {
    const seen = new Set();
    for (let b = a; b < hits.length && hits[b][0] < hits[a][0] + len - 60; b++) seen.add(hits[b][1]);
    if (seen.size > best) {
      best = seen.size;
      pos = hits[a][0];
    }
  }
  const start = Math.max(0, pos - 50);
  let chunk = text.slice(start, start + len);
  let out = esc(chunk);
  if (keys.length && norm.length === text.length) {
    const normChunk = norm.slice(start, start + len);
    const ranges = [];
    const re = new RegExp(keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
    let m;
    while ((m = re.exec(normChunk))) ranges.push([m.index, m.index + m[0].length]);
    if (ranges.length) {
      out = '';
      let last = 0;
      for (const [a, b] of ranges) {
        out += esc(chunk.slice(last, a)) + '<mark>' + esc(chunk.slice(a, b)) + '</mark>';
        last = b;
      }
      out += esc(chunk.slice(last));
    }
  }
  return (start > 0 ? '… ' : '') + out + (start + len < text.length ? ' …' : '');
}

export function highlightTitle(title, terms) {
  const keys = terms.map(normalize).filter((k) => k.length > 1);
  const norm = normalize(title);
  if (!keys.length || norm.length !== title.length) return esc(title);
  const re = new RegExp(keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(norm))) {
    out += esc(title.slice(last, m.index)) + '<mark>' + esc(title.slice(m.index, m.index + m[0].length)) + '</mark>';
    last = m.index + m[0].length;
  }
  return out + esc(title.slice(last));
}

export function topLevelScopes() {
  return store.root ? store.root.children.filter((c) => c.type === 'folder') : [];
}

export { ancestors };
