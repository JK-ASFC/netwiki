// Panneau latéral : arborescence (ou liste à plat), favoris, filtre rapide, glisser-déposer.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon } from './icons.js';
import { $, $$, esc, normalize } from './ui.js';
import { ancestors, crumbText, getNode, iconOf, pagesUnder, store, tintOf } from './store.js';
import { actions, state } from './state.js';
import { openAbout } from './legal.js';

const collator = new Intl.Collator('fr', { sensitivity: 'base', numeric: true });

function expanded() {
  return new Set(state.settings.expanded || []);
}

function setExpanded(set) {
  actions.saveSettings({ expanded: [...set] });
}

function currentPath() {
  return state.view.path ?? null;
}

function highlight(text, q) {
  if (!q) return esc(text);
  const n = normalize(text);
  const i = n.indexOf(q);
  if (i < 0 || n.length !== text.length) return esc(text);
  return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
}

// ---------------------------------------------------------------- squelette

export function initSidebar() {
  const sb = $('#sidebar');
  sb.innerHTML = `
    <div class="sb-head">
      <div class="sb-filter">${icon('list-filter', 15)}
        <input id="sb-filter" placeholder="Filtrer les titres…" spellcheck="false">
        <button class="icon-btn sm clear" id="sb-filter-clear" style="display:none">${icon('x', 14)}</button>
      </div>
      <div class="segmented" id="sb-mode">
        <span class="thumb"></span>
        <button data-mode="tree">${icon('list-tree', 14)}Arborescence</button>
        <button data-mode="flat">${icon('list', 14)}Liste A–Z</button>
      </div>
    </div>
    <div class="sb-scroll" id="sb-scroll"></div>
    <div class="sb-foot"><span class="dot"></span><span id="sb-count"></span>
      <button class="sb-support" id="sb-support" data-tip="Soutenir NetWiki (faire un don)">${icon('heart', 13)}Soutenir</button></div>`;

  $('#sb-support').onclick = () => openAbout('soutenir');

  const input = $('#sb-filter');
  input.addEventListener('input', () => {
    state.filter = normalize(input.value.trim());
    $('#sb-filter-clear').style.display = input.value ? '' : 'none';
    renderSidebarBody();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.blur();
    } else if (e.key === 'Enter') {
      $('#sb-scroll .tree-row.is-page, #sb-scroll .flat-row')?.click();
    }
  });
  $('#sb-filter-clear').onclick = () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
  };

  $$('#sb-mode button').forEach((b) => {
    b.onclick = () => {
      actions.saveSettings({ sidebarMode: b.dataset.mode });
      renderSidebarBody();
    };
  });

  const scroll = $('#sb-scroll');
  scroll.addEventListener('click', onClick);
  scroll.addEventListener('contextmenu', onContext);
  scroll.addEventListener('dragstart', onDragStart);
  scroll.addEventListener('dragover', onDragOver);
  scroll.addEventListener('dragleave', (e) => e.target.closest?.('.tree-row')?.classList.remove('drop-target'));
  scroll.addEventListener('drop', onDrop);
  scroll.addEventListener('dragend', () => $$('.dragging, .drop-target', scroll).forEach((r) => r.classList.remove('dragging', 'drop-target')));
}

function updateSegmented() {
  const mode = state.settings.sidebarMode || 'tree';
  const seg = $('#sb-mode');
  $$('button', seg).forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  const on = $('button.on', seg);
  const thumb = $('.thumb', seg);
  if (on) {
    thumb.style.left = on.offsetLeft + 'px';
    thumb.style.width = on.offsetWidth + 'px';
  }
}

// ---------------------------------------------------------------- rendu

export function renderSidebar() {
  renderSidebarBody();
  $('#sb-count').textContent = `${store.pages.size} articles · © JK-ASFC`;
}

function renderSidebarBody() {
  updateSegmented();
  const scroll = $('#sb-scroll');
  const mode = state.settings.sidebarMode || 'tree';
  const q = state.filter;
  let html = '';

  const favs = (state.settings.favorites || []).map((p) => store.pages.get(p)).filter(Boolean);
  if (favs.length && !q) {
    html += `<div class="sb-section"><div class="sb-section-title">${icon('star', 13)}Favoris</div>`;
    html += favs.map((p) => pageRow(p, 0, '', 'fav')).join('');
    html += '</div>';
  }

  if (mode === 'flat') html += flatList(q);
  else {
    html += `<div class="sb-section" data-root><div class="sb-section-title">${icon('library', 13)}Bibliothèque<span class="spacer"></span>
      <button class="icon-btn sm" data-act="new-folder-root" data-tip="Nouveau dossier">${icon('folder-plus', 14)}</button>
      <button class="icon-btn sm" data-act="new-page-root" data-tip="Nouvel article">${icon('file-plus', 14)}</button></div>`;
    const body = treeHtml(store.root, 0, q);
    html += body || `<div class="empty-hint">Aucun titre ne correspond à « ${esc(q)} ».</div>`;
    html += '</div>';
  }
  scroll.innerHTML = html;
  requestAnimationFrame(() => $('.tree-row.active, .flat-row.active', scroll)?.scrollIntoView({ block: 'nearest' }));
}

function matches(node, q) {
  return normalize(node.title).includes(q);
}

function subtreeMatches(folder, q) {
  return folder.children.some((c) => matches(c, q) || (c.type === 'folder' && subtreeMatches(c, q)));
}

function treeHtml(folder, depth, q) {
  const exp = expanded();
  let out = '';
  for (const c of folder.children) {
    if (c.type === 'page') {
      if (!q || matches(c, q)) out += pageRow(c, depth, q);
      continue;
    }
    const hit = q && matches(c, q);
    const inside = q && subtreeMatches(c, q);
    if (q && !hit && !inside) continue;
    const open = q ? true : exp.has(c.path);
    const tint = tintOf(c);
    const active = currentPath() === c.path && state.view.type === 'folder';
    out += `<div class="tree-row is-folder ${open ? 'open' : ''} ${active ? 'active' : ''}" data-path="${esc(c.path)}" data-type="folder" draggable="true" style="--depth:${depth};${tint ? `--tint:${tint}` : ''}">
      <span class="chev" data-act="toggle">${icon('chevron-right', 14)}</span><span class="ticon">${icon(iconOf(c) === 'folder' && open ? 'folder-open' : iconOf(c), 16)}</span>
      <span class="tlabel">${highlight(c.title, q)}</span><span class="count">${pagesUnder(c).length}</span></div>`;
    const kids = open ? treeHtml(c, depth + 1, q && !hit ? q : '') : '';
    out += `<div class="tree-children ${open ? 'open' : ''}" style="--depth:${depth}"><div>${kids}</div></div>`;
  }
  return out;
}

function pageRow(p, depth, q, extra = '') {
  const tint = tintOf(p);
  const active = currentPath() === p.path && (state.view.type === 'page' || state.view.type === 'edit');
  return `<div class="tree-row is-page ${extra} ${active ? 'active' : ''}" data-path="${esc(p.path)}" data-type="page" draggable="${extra ? 'false' : 'true'}" style="--depth:${depth};${tint ? `--tint:${tint}` : ''}">
    <span class="chev none"></span><span class="ticon">${icon(iconOf(p), 15)}</span><span class="tlabel">${highlight(p.title, q)}</span></div>`;
}

function flatList(q) {
  const list = [...store.pages.values()].filter((p) => !q || normalize(p.title).includes(q) || normalize(crumbText(p)).includes(q));
  list.sort((a, b) => collator.compare(a.title, b.title));
  if (!list.length) return `<div class="empty-hint">Aucun article.</div>`;
  let out = '<div class="sb-section">';
  let letter = '';
  for (const p of list) {
    const l = normalize(p.title[0] || '#').toUpperCase();
    if (l !== letter) {
      letter = l;
      out += `<div class="flat-group">${esc(letter)}</div>`;
    }
    const tint = tintOf(p);
    out += `<div class="flat-row ${currentPath() === p.path ? 'active' : ''}" data-path="${esc(p.path)}" data-type="page" style="${tint ? `--tint:${tint}` : ''}">
      <span class="ticon">${icon(iconOf(p), 15)}</span><div><div class="ft">${highlight(p.title, q)}</div><div class="fp">${esc(crumbText(p) || 'Racine')}</div></div></div>`;
  }
  return out + '</div>';
}

// ---------------------------------------------------------------- interactions

function toggleFolder(path, force) {
  const set = expanded();
  const open = force ?? !set.has(path);
  if (open) set.add(path);
  else set.delete(path);
  setExpanded(set);
  renderSidebarBody();
}

function onClick(e) {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'new-page-root') return actions.newPage('');
  if (act === 'new-folder-root') return actions.newFolder('');
  const row = e.target.closest('[data-path]');
  if (!row) return;
  const path = row.dataset.path;
  if (row.dataset.type === 'folder') {
    if (act === 'toggle') return toggleFolder(path);
    const isOpen = expanded().has(path);
    const isActive = state.view.type === 'folder' && state.view.path === path;
    if (isActive && isOpen) return toggleFolder(path, false);
    if (!isOpen) toggleFolder(path, true);
    actions.navigate({ type: 'folder', path });
  } else {
    actions.navigate({ type: 'page', path });
  }
}

function onContext(e) {
  e.preventDefault();
  const row = e.target.closest('[data-path]');
  const node = row ? getNode(row.dataset.path) : store.root;
  if (!node) return;
  actions.nodeMenu(node, e.clientX, e.clientY);
}

let dragPath = null;

function onDragStart(e) {
  const row = e.target.closest('.tree-row[draggable=true]');
  if (!row) return;
  dragPath = row.dataset.path;
  row.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragPath);
}

function dropFolderFor(e) {
  const row = e.target.closest('.tree-row');
  if (row) {
    const node = getNode(row.dataset.path);
    return node?.type === 'folder' ? node : node?.parent;
  }
  return e.target.closest('[data-root]') ? store.root : null;
}

function onDragOver(e) {
  if (!dragPath) return;
  const folder = dropFolderFor(e);
  if (!folder) return;
  const src = getNode(dragPath);
  if (!src || folder === src.parent || folder.path === dragPath || folder.path.startsWith(dragPath + '/')) return;
  e.preventDefault();
  $$('.drop-target').forEach((r) => r.classList.remove('drop-target'));
  $(`.tree-row[data-path="${CSS.escape(folder.path)}"]`)?.classList.add('drop-target');
}

async function onDrop(e) {
  e.preventDefault();
  const folder = dropFolderFor(e);
  const src = dragPath;
  dragPath = null;
  $$('.drop-target').forEach((r) => r.classList.remove('drop-target'));
  if (!folder || !src) return;
  await actions.move(src, folder.path);
}

/** Déplie les dossiers parents de la page courante et rafraîchit la sélection. */
export function revealInSidebar(node) {
  if (node) {
    const set = expanded();
    let changed = false;
    for (const a of ancestors(node)) {
      if (!set.has(a.path)) {
        set.add(a.path);
        changed = true;
      }
    }
    if (changed) setExpanded(set);
  }
  renderSidebarBody();
}

