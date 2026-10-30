// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon } from '../icons.js';
import { esc, relativeTime } from '../ui.js';
import { ancestors, iconOf, pagesUnder, tintOf } from '../store.js';

export function crumbsHtml(node) {
  const parts = [`<a data-act="home">${icon('house', 14)}Accueil</a>`];
  for (const a of ancestors(node)) parts.push(`<a data-folder="${esc(a.path)}">${esc(a.title)}</a>`);
  return `<nav class="crumbs">${parts.join(icon('chevron-right', 13))}</nav>`;
}

export function renderFolder(view, folder) {
  const tint = tintOf(folder);
  const subs = folder.children.filter((c) => c.type === 'folder');
  const pages = folder.children.filter((c) => c.type === 'page');
  const total = pagesUnder(folder).length;

  let html = `<div class="page-wrap"><div class="page reading-wide" style="${tint ? `--tint:${tint}` : ''}">
    ${crumbsHtml(folder)}
    <header class="page-head">
      <div class="page-head-top">
        <div class="page-icon">${icon(iconOf(folder), 26)}</div>
        <div class="page-title"><h1>${esc(folder.title)}</h1>${folder.description ? `<p class="desc">${esc(folder.description)}</p>` : ''}</div>
        <div class="page-actions">
          <button class="btn primary sm" data-act="new-page">${icon('file-plus', 15)}Article</button>
          <button class="btn sm" data-act="new-folder">${icon('folder-plus', 15)}Dossier</button>
          <button class="icon-btn" data-act="folder-props" data-tip="Propriétés du dossier">${icon('settings-2', 17)}</button>
          <button class="icon-btn" data-act="more" data-tip="Plus d'actions">${icon('ellipsis', 17)}</button>
        </div>
      </div>
      <div class="page-meta"><span>${icon('file-text', 14)}${total} article${total > 1 ? 's' : ''}</span>${subs.length ? `<span>${icon('folder', 14)}${subs.length} sous-dossier${subs.length > 1 ? 's' : ''}</span>` : ''}</div>
    </header>`;

  if (subs.length) {
    html += `<div class="cards">${subs
      .map((f) => {
        const n = pagesUnder(f).length;
        const t = tintOf(f);
        return `<div class="card" data-folder="${esc(f.path)}" style="${t ? `--tint:${t}` : ''}">
          <div class="card-icon">${icon(iconOf(f), 21)}</div><h4>${esc(f.title)}</h4><p>${esc(f.description || '')}</p>
          <div class="card-foot">${icon('file-text', 13)}${n} article${n > 1 ? 's' : ''}<span class="arrow">${icon('arrow-right', 16)}</span></div></div>`;
      })
      .join('')}</div>`;
  }

  if (pages.length) {
    html += `<div class="list-cards" style="margin-top:${subs.length ? 22 : 0}px">${pages
      .map(
        (p, i) => `<div class="list-card" data-page="${esc(p.path)}">
        <span class="lc-num">${String(i + 1).padStart(2, '0')}</span>
        <div class="lc-icon">${icon(iconOf(p), 17)}</div>
        <div class="lc-body"><div class="lc-title">${esc(p.title)}</div><div class="lc-desc">${esc(p.description)}</div></div>
        <div class="lc-meta">${esc(relativeTime(p.mtime))}</div></div>`
      )
      .join('')}</div>`;
  }

  if (!subs.length && !pages.length) {
    html += `<div class="empty-hint" style="padding:60px">${icon('folder-open', 40)}<p>Ce dossier est vide.</p>
      <button class="btn primary" data-act="new-page">${icon('file-plus', 16)}Créer le premier article</button></div>`;
  }

  view.innerHTML = html + '</div></div>';
}
