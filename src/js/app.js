// NetWiki — point d'entrée du renderer : navigation, actions sur le contenu, raccourcis clavier.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { hasIcon, icon } from './icons.js';
import { $, confirmDialog, contextMenu, debounce, esc, promptDialog, toast } from './ui.js';
import { buildStore, getNode, store } from './store.js';
import { buildIndex } from './search.js';
import { actions, api, state } from './state.js';
import { initSidebar, renderSidebar, revealInSidebar } from './sidebar.js';
import { renderHome } from './views/home.js';
import { renderFolder } from './views/folder.js';
import { renderPage, scrollToAnchor } from './views/page.js';
import { renderEditor } from './views/editor.js';
import { isPaletteOpen, openPalette } from './views/palette.js';
import { openSettings } from './views/settings.js';
import { TEMPLATES, folderPropsDialog, moveDialog, newFolderDialog, newPageDialog } from './dialogs.js';
import { stringifyFrontmatter } from './frontmatter.js';
import { renderMarkdown, renderMermaid } from './markdown.js';
import hljs from './hl.js';
import { initUpdates } from './updates.js';

const view = $('#view');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ================================================================ paramètres & apparence

const persist = debounce(() => api.setSettings(state.settings), 300);
actions.saveSettings = (patch) => {
  Object.assign(state.settings, patch);
  persist();
};

const media = matchMedia('(prefers-color-scheme: dark)');
const effectiveTheme = () => (state.settings.theme === 'system' ? (media.matches ? 'dark' : 'light') : state.settings.theme);

actions.applyAppearance = (rerender = false) => {
  const root = document.documentElement;
  const theme = effectiveTheme();
  root.dataset.theme = theme;
  root.style.setProperty('--accent', state.settings.accent || '#6366f1');
  root.style.setProperty('--fs', (state.settings.fontSize || 16) + 'px');
  root.style.setProperty('--sidebar-w', (state.settings.sidebarWidth || 300) + 'px');
  root.classList.toggle('no-fx', state.settings.effects === false);
  api.setTitleBar({ color: '#00000000', symbolColor: theme === 'light' ? '#3b4152' : '#c9cdd8' });
  $('#btn-theme').innerHTML = icon(theme === 'light' ? 'moon' : 'sun', 18);
  if (rerender && state.view.type !== 'edit') actions.rerender();
};
media.addEventListener('change', () => state.settings.theme === 'system' && actions.applyAppearance(true));

actions.toggleTheme = () => {
  actions.saveSettings({ theme: effectiveTheme() === 'dark' ? 'light' : 'dark' });
  actions.applyAppearance(true);
};

actions.toggleSidebar = () => {
  const hidden = !document.body.classList.contains('sidebar-hidden');
  document.body.classList.toggle('sidebar-hidden', hidden);
  actions.saveSettings({ sidebarHidden: hidden });
};

actions.openSettings = openSettings;
actions.openDataDir = () => api.openDataDir();

// ================================================================ chargement des données

actions.reload = async (rerender = false) => {
  const tree = await api.load();
  buildStore(tree);
  buildIndex();
  renderSidebar();
  if (rerender) actions.rerender();
};

// ================================================================ navigation

function updateNavButtons() {
  $('#btn-back').disabled = state.hIndex <= 0;
  $('#btn-forward').disabled = state.hIndex >= state.history.length - 1;
}

function addRecent(path) {
  const recent = [path, ...(state.settings.recent || []).filter((p) => p !== path)].slice(0, 15);
  actions.saveSettings({ recent });
}

// Remise en haut immédiate : le défilement « smooth » du conteneur annulerait sinon un simple scrollTop = 0
// pendant le remplacement du contenu (la nouvelle page s'afficherait à l'ancienne position).
function scrollViewToTop() {
  view.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function renderView({ anchor, terms, quiet = false } = {}) {
  const v = state.view;
  if (!quiet) {
    view.classList.remove('view-enter');
    void view.offsetWidth;
    view.classList.add('view-enter');
    scrollViewToTop();
  }
  let node = null;
  if (v.type === 'folder') {
    node = store.folders.get(v.path);
    if (!node) return actions.navigate({ type: 'home' }, { replace: true, force: true });
    renderFolder(view, node);
    document.title = `${node.title} — NetWiki`;
  } else if (v.type === 'page') {
    node = store.pages.get(v.path);
    if (!node) {
      toast('Cet article n’existe plus', 'error');
      return actions.navigate({ type: 'home' }, { replace: true, force: true });
    }
    renderPage(view, node, { anchor, terms });
    addRecent(node.path);
    document.title = `${node.title} — NetWiki`;
  } else if (v.type === 'edit') {
    node = v.draft ? null : store.pages.get(v.path);
    renderEditor(view, v.draft || node);
    document.title = `Édition — NetWiki`;
  } else {
    renderHome(view);
    document.title = 'NetWiki';
  }
  revealInSidebar(node);
  // Sans ancre ni termes à surligner, chaque navigation repart du haut de la page,
  // y compris après le calcul de mise en page (images, diagrammes, sommaire).
  if (!quiet && !anchor && !terms?.length) {
    scrollViewToTop();
    requestAnimationFrame(scrollViewToTop);
  }
}

actions.rerender = () => {
  const top = view.scrollTop;
  renderView({ quiet: true });
  view.scrollTop = top;
};

actions.navigate = async (target, opts = {}) => {
  if (!opts.force && state.view.type === 'edit' && state.editor?.dirty) {
    const ok = await confirmDialog('Modifications non enregistrées', 'Quitter l’éditeur et perdre les modifications en cours ?', {
      danger: true,
      ok: 'Quitter sans enregistrer',
    });
    if (!ok) return false;
  }
  if (state.view.type === 'edit' && target.type !== 'edit') state.editor = null;
  if (!opts.fromHistory) {
    const replace = opts.replace || (state.view.type === 'edit' && target.type !== 'edit');
    if (replace && state.hIndex >= 0) state.history[state.hIndex] = target;
    else {
      state.history = state.history.slice(0, state.hIndex + 1);
      state.history.push(target);
      state.hIndex = state.history.length - 1;
    }
  }
  state.view = target;
  renderView(opts);
  updateNavButtons();
  return true;
};

async function go(delta) {
  const i = state.hIndex + delta;
  if (i < 0 || i >= state.history.length) return;
  const prev = state.hIndex;
  state.hIndex = i;
  const ok = await actions.navigate(state.history[i], { fromHistory: true });
  if (!ok) state.hIndex = prev;
  updateNavButtons();
}

actions.back = (fallback) => {
  if (state.hIndex > 0) return go(-1);
  return actions.navigate(fallback || { type: 'home' }, { replace: true });
};

// ================================================================ actions sur le contenu

function currentFolderPath() {
  const v = state.view;
  if (v.type === 'folder') return v.path;
  if (v.type === 'page') return store.pages.get(v.path)?.parent?.path || '';
  return '';
}

function remapPaths(from, to) {
  const map = (p) => (p === from ? to : p.startsWith(from + '/') ? to + p.slice(from.length) : p);
  const drop = (p) => to !== null || (p !== from && !p.startsWith(from + '/'));
  const s = state.settings;
  actions.saveSettings({
    favorites: (s.favorites || []).filter(drop).map(map),
    recent: (s.recent || []).filter(drop).map(map),
    expanded: (s.expanded || []).filter(drop).map(map),
  });
  state.history = state.history.map((h) => (h.path && to !== null ? { ...h, path: map(h.path) } : h));
}

actions.newPage = async (folderPath) => {
  const res = await newPageDialog(folderPath ?? currentFolderPath());
  if (!res) return;
  const draft = { isNew: true, folder: res.folder, title: res.title, fm: { title: res.title }, body: TEMPLATES[res.template].body, tags: [] };
  actions.navigate({ type: 'edit', path: null, draft });
};

actions.newFolder = async (parentPath) => {
  const res = await newFolderDialog(parentPath ?? currentFolderPath());
  if (!res) return;
  const path = await api.createFolder(res.parent ?? '', res.meta);
  await actions.reload();
  toast(`Dossier « ${res.meta.title} » créé`);
  actions.navigate({ type: 'folder', path });
};

actions.folderProps = async (folder) => {
  const res = await folderPropsDialog(folder);
  if (!res) return;
  await api.setFolderMeta(folder.path, res.meta);
  await actions.reload(true);
  toast('Dossier mis à jour');
};

actions.renamePage = async (page) => {
  const title = await promptDialog('Renommer l’article', { label: 'Nouveau titre', value: page.title, ok: 'Renommer' });
  if (!title || title === page.title) return;
  await api.write(page.path, stringifyFrontmatter({ ...page.fm, title }, page.body));
  await actions.reload(true);
  toast('Article renommé');
};

actions.move = async (path, targetFolder) => {
  try {
    const newPath = await api.move(path, targetFolder);
    remapPaths(path, newPath);
    if (state.view.path && (state.view.path === path || state.view.path.startsWith(path + '/'))) {
      state.view = { ...state.view, path: newPath + state.view.path.slice(path.length) };
    }
    await actions.reload(true);
    toast('Élément déplacé');
  } catch (err) {
    toast(err.message, 'error', 5000);
  }
};

actions.moveNode = async (node) => {
  const target = await moveDialog(node);
  if (target === null || target === undefined) return;
  if (target === (node.parent?.path ?? '')) return;
  actions.move(node.path, target);
};

actions.deleteNode = async (node) => {
  const isFolder = node.type === 'folder';
  const ok = await confirmDialog(
    isFolder ? 'Supprimer le dossier' : 'Supprimer l’article',
    `« <b>${esc(node.title)}</b> »${isFolder ? ' et tout son contenu' : ''} sera déplacé dans la corbeille du système.`,
    { danger: true, ok: 'Supprimer' }
  );
  if (!ok) return;
  await api.remove(node.path);
  remapPaths(node.path, null);
  const inside = state.view.path && (state.view.path === node.path || state.view.path.startsWith(node.path + '/'));
  await actions.reload();
  toast(isFolder ? 'Dossier supprimé' : 'Article supprimé');
  if (inside) actions.navigate(node.parent?.path ? { type: 'folder', path: node.parent.path } : { type: 'home' }, { replace: true, force: true });
  else actions.rerender();
};

actions.duplicate = async (page) => {
  const path = await api.duplicate(page.path);
  await actions.reload();
  toast('Article dupliqué');
  actions.navigate({ type: 'page', path });
};

actions.toggleFav = (path) => {
  const favs = new Set(state.settings.favorites || []);
  const added = !favs.has(path);
  if (added) favs.add(path);
  else favs.delete(path);
  actions.saveSettings({ favorites: [...favs] });
  toast(added ? 'Ajouté aux favoris' : 'Retiré des favoris', 'info', 1800);
  renderSidebar();
  if (state.view.type === 'page') actions.rerender();
};

actions.exportPdf = async (page) => {
  const root = document.documentElement;
  const theme = root.dataset.theme;
  root.dataset.theme = 'light';
  actions.rerender();
  await sleep(700);
  try {
    const file = await api.exportPdf(page.title);
    if (file) toast('PDF exporté');
  } finally {
    root.dataset.theme = theme;
    actions.rerender();
  }
};

actions.nodeMenu = (node, x, y) => {
  if (node.type === 'page') {
    const fav = (state.settings.favorites || []).includes(node.path);
    contextMenu(x, y, [
      { label: 'Ouvrir', icon: 'file-text', action: () => actions.navigate({ type: 'page', path: node.path }) },
      { label: 'Modifier', icon: 'pencil', kbd: 'Ctrl E', action: () => actions.navigate({ type: 'edit', path: node.path }) },
      { label: 'Renommer', icon: 'text-cursor-input', action: () => actions.renamePage(node) },
      { label: fav ? 'Retirer des favoris' : 'Ajouter aux favoris', icon: 'star', action: () => actions.toggleFav(node.path) },
      '-',
      { label: 'Dupliquer', icon: 'copy', action: () => actions.duplicate(node) },
      { label: 'Déplacer vers…', icon: 'folder-input', action: () => actions.moveNode(node) },
      { label: 'Exporter en PDF', icon: 'file-down', action: () => actions.navigate({ type: 'page', path: node.path }).then(() => actions.exportPdf(node)) },
      { label: 'Afficher dans le dossier', icon: 'folder-search', action: () => api.reveal(node.path) },
      '-',
      { label: 'Supprimer', icon: 'trash-2', danger: true, action: () => actions.deleteNode(node) },
    ]);
  } else {
    const isRoot = !node.path;
    contextMenu(x, y, [
      { label: 'Nouvel article ici', icon: 'file-plus', action: () => actions.newPage(node.path) },
      { label: 'Nouveau sous-dossier', icon: 'folder-plus', action: () => actions.newFolder(node.path) },
      ...(isRoot
        ? ['-', { label: 'Ouvrir le dossier des données', icon: 'folder-open', action: () => api.openDataDir() }]
        : [
            '-',
            { label: 'Ouvrir la vue dossier', icon: 'layout-grid', action: () => actions.navigate({ type: 'folder', path: node.path }) },
            { label: 'Propriétés (nom, icône, couleur)', icon: 'settings-2', action: () => actions.folderProps(node) },
            { label: 'Déplacer vers…', icon: 'folder-input', action: () => actions.moveNode(node) },
            { label: 'Afficher dans le dossier', icon: 'folder-search', action: () => api.reveal(node.path) },
            '-',
            { label: 'Supprimer le dossier', icon: 'trash-2', danger: true, action: () => actions.deleteNode(node) },
          ]),
    ]);
  }
};

// ================================================================ événements de la vue principale

view.addEventListener('click', (e) => {
  const el = e.target.closest('[data-page], [data-folder], [data-act], [data-tag], [data-anchor], [data-href]');
  if (!el || !view.contains(el) || el.closest('.editor .ed-bar, .editor .ed-tools, .editor .ed-meta')) return;
  const d = el.dataset;
  if (d.href) return api.openExternal(d.href);
  if (d.page) {
    if (state.view.type === 'page' && d.page === state.view.path && d.anchor) return scrollToAnchor(view, d.anchor);
    return actions.navigate({ type: 'page', path: d.page }, { anchor: d.anchor });
  }
  if (d.anchor) return scrollToAnchor(view, d.anchor);
  if (d.folder !== undefined) return actions.navigate({ type: 'folder', path: d.folder });
  if (d.tag) return openPalette('#' + d.tag);

  const node = state.view.path ? getNode(state.view.path) : null;
  switch (d.act) {
    case 'home':
      return actions.navigate({ type: 'home' });
    case 'search':
      return openPalette();
    case 'new':
      return actions.newPage();
    case 'new-page':
      return actions.newPage(state.view.type === 'folder' ? state.view.path : undefined);
    case 'new-folder':
      return actions.newFolder(state.view.type === 'folder' ? state.view.path : undefined);
    case 'folder-props':
      return node && actions.folderProps(node);
    case 'edit':
      return actions.navigate({ type: 'edit', path: state.view.path });
    case 'fav':
      return actions.toggleFav(state.view.path);
    case 'more': {
      const r = el.getBoundingClientRect();
      return node && actions.nodeMenu(node, r.left - 160, r.bottom + 6);
    }
  }
});

view.addEventListener('contextmenu', (e) => {
  const el = e.target.closest('[data-page], [data-folder]');
  if (!el || el.closest('.md')) return;
  const node = getNode(el.dataset.page ?? el.dataset.folder);
  if (!node) return;
  e.preventDefault();
  actions.nodeMenu(node, e.clientX, e.clientY);
});

// ================================================================ barre de titre, redimensionnement, raccourcis

function initChrome() {
  $('#btn-sidebar').innerHTML = icon('panel-left', 18);
  $('#btn-back').innerHTML = icon('arrow-left', 18);
  $('#btn-forward').innerHTML = icon('arrow-right', 18);
  $('#btn-new').innerHTML = icon('square-pen', 18);
  $('#btn-settings').innerHTML = icon('settings', 18);
  $('.brand-logo').innerHTML = icon('network', 15);
  $('.st-icon').innerHTML = icon('search', 16);

  $('#btn-sidebar').onclick = actions.toggleSidebar;
  $('#btn-back').onclick = () => go(-1);
  $('#btn-forward').onclick = () => go(1);
  $('#btn-search').onclick = () => openPalette();
  $('#btn-new').onclick = () => actions.newPage();
  $('#btn-theme').onclick = actions.toggleTheme;
  $('#btn-settings').onclick = openSettings;
  $('#brand').onclick = () => actions.navigate({ type: 'home' });

  const resizer = $('#resizer');
  resizer.addEventListener('pointerdown', (e) => {
    resizer.setPointerCapture(e.pointerId);
    resizer.classList.add('dragging');
    const move = (ev) => {
      const w = Math.max(220, Math.min(560, ev.clientX));
      document.documentElement.style.setProperty('--sidebar-w', w + 'px');
      state.settings.sidebarWidth = w;
    };
    const up = () => {
      resizer.classList.remove('dragging');
      resizer.removeEventListener('pointermove', move);
      actions.saveSettings({ sidebarWidth: state.settings.sidebarWidth });
    };
    resizer.addEventListener('pointermove', move);
    resizer.addEventListener('pointerup', up, { once: true });
  });

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return;
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key.toLowerCase();
    const inModal = document.querySelector('#overlays .modal');
    if (mod && (k === 'k' || k === 'p')) {
      e.preventDefault();
      if (!inModal) openPalette();
    } else if (inModal || isPaletteOpen()) {
      return;
    } else if (mod && k === 'n') {
      e.preventDefault();
      actions.newPage();
    } else if (mod && k === 'e' && state.view.type === 'page') {
      e.preventDefault();
      actions.navigate({ type: 'edit', path: state.view.path });
    } else if (mod && k === 'b' && state.view.type !== 'edit') {
      e.preventDefault();
      actions.toggleSidebar();
    } else if (mod && k === ',') {
      e.preventDefault();
      openSettings();
    } else if (mod && k === 's' && state.view.type === 'edit') {
      e.preventDefault();
      state.editor?.save();
    } else if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'F5') {
      e.preventDefault();
      actions.reload(true);
    }
  });

  // boutons « précédent / suivant » de la souris
  window.addEventListener('mouseup', (e) => {
    if (e.button === 3) go(-1);
    if (e.button === 4) go(1);
  });

  window.addEventListener('beforeunload', () => api.setSettings(state.settings));
}

// ================================================================ démarrage

async function init() {
  document.documentElement.classList.add('platform-' + api.platform);
  state.info = await api.info();
  state.settings = await api.getSettings();
  initChrome();
  actions.applyAppearance();
  if (state.settings.sidebarHidden) document.body.classList.add('sidebar-hidden');
  initSidebar();
  await actions.reload();
  actions.navigate({ type: 'home' });

  api.onChanged(async () => {
    await actions.reload();
    if (state.view.type !== 'edit') actions.rerender();
  });

  // Point d'accès pour le diagnostic depuis les outils de développement (F12) et les tests automatisés.
  window.__netwiki = { store, state, actions, hljs, hasIcon, renderMarkdown, renderMermaid };

  // Mises à jour : accord demandé une seule fois, jamais pendant les tests automatisés.
  if (!state.info.automation) setTimeout(() => initUpdates().catch(() => {}), 1200);
}

init().catch((err) => {
  console.error(err);
  view.innerHTML = `<div class="page-wrap"><div class="page"><h2>Erreur au démarrage</h2><pre>${esc(err.stack || err)}</pre></div></div>`;
});
