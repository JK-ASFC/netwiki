// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon } from '../icons.js';
import { esc, relativeTime } from '../ui.js';
import { crumbText, iconOf, pagesUnder, stats, store, tintOf } from '../store.js';
import { state } from '../state.js';

function fmt(n) {
  return new Intl.NumberFormat('fr-FR').format(n);
}

function folderCard(f) {
  const n = pagesUnder(f).length;
  const tint = tintOf(f);
  return `<div class="card" data-folder="${esc(f.path)}" style="${tint ? `--tint:${tint}` : ''}">
    <div class="card-icon">${icon(iconOf(f), 21)}</div>
    <h4>${esc(f.title)}</h4>
    <p>${esc(f.description || 'Aucune description.')}</p>
    <div class="card-foot">${icon('file-text', 13)}${n} article${n > 1 ? 's' : ''}<span class="arrow">${icon('arrow-right', 16)}</span></div>
  </div>`;
}

function pageItem(p, meta) {
  const tint = tintOf(p);
  return `<div class="list-card" data-page="${esc(p.path)}" style="${tint ? `--tint:${tint}` : ''}">
    <div class="lc-icon">${icon(iconOf(p), 17)}</div>
    <div class="lc-body"><div class="lc-title">${esc(p.title)}</div><div class="lc-desc">${esc(crumbText(p) || 'Racine')}</div></div>
    <div class="lc-meta">${esc(meta || '')}</div></div>`;
}

export function renderHome(view) {
  const s = stats();
  const categories = store.root.children.filter((c) => c.type === 'folder');
  const rootPages = store.root.children.filter((c) => c.type === 'page');

  let html = `<div class="home">
    <section class="hero">
      <span class="hero-kicker">${icon('sparkles', 14)}Base de connaissances locale</span>
      <h1>Le wiki de <span class="grad">l'architecte réseau</span></h1>
      <p>Présentation, installation et configuration — de la base aux options avancées — des services d'infrastructure.
      Tout est stocké en Markdown sur votre machine : ajoutez, modifiez et organisez librement.</p>
      <div class="hero-actions">
        <button class="hero-search" data-act="search">${icon('search', 18)}<span>Rechercher une commande, un service, une option…</span><kbd>Ctrl K</kbd></button>
        <button class="btn primary" data-act="new">${icon('plus', 17)}Nouvel article</button>
        ${rootPages[0] ? `<button class="btn" data-page="${esc(rootPages[0].path)}">${icon('book-open', 17)}${esc(rootPages[0].title)}</button>` : ''}
      </div>
    </section>
    <div class="stats">
      <div class="stat"><b>${fmt(s.pages)}</b><span>${icon('file-text', 13)}articles</span></div>
      <div class="stat"><b>${fmt(s.services)}</b><span>${icon('server', 13)}services documentés</span></div>
      <div class="stat"><b>${fmt(s.words)}</b><span>${icon('text', 13)}mots</span></div>
      <div class="stat"><b>${fmt(s.tags)}</b><span>${icon('tags', 13)}étiquettes</span></div>
    </div>`;

  for (const cat of categories) {
    const sub = cat.children.filter((c) => c.type === 'folder');
    const pages = cat.children.filter((c) => c.type === 'page');
    const tint = tintOf(cat);
    html += `<div class="section-title" style="${tint ? `--tint:${tint}` : ''}"><span class="tint">${icon(iconOf(cat), 16)}</span>${esc(cat.title)}</div>`;
    if (sub.length) html += `<div class="cards">${sub.map(folderCard).join('')}</div>`;
    if (pages.length) html += `<div class="list-cards" style="margin-top:10px">${pages.map((p) => pageItem(p, relativeTime(p.mtime))).join('')}</div>`;
    if (!sub.length && !pages.length) html += `<div class="cards">${folderCard(cat)}</div>`;
  }

  const recent = (state.settings.recent || []).map((p) => store.pages.get(p)).filter(Boolean).slice(0, 6);
  const modified = [...store.pages.values()].sort((a, b) => b.mtime - a.mtime).slice(0, 6);
  html += `<div class="two-cols">
    <div><div class="section-title">${icon('history', 15)}Consultés récemment</div>
      <div class="list-cards">${recent.length ? recent.map((p) => pageItem(p, '')).join('') : '<div class="empty-hint">Les articles ouverts apparaîtront ici.</div>'}</div></div>
    <div><div class="section-title">${icon('pencil-line', 15)}Modifiés récemment</div>
      <div class="list-cards">${modified.map((p) => pageItem(p, relativeTime(p.mtime))).join('')}</div></div>
  </div></div>`;

  view.innerHTML = html;
}
