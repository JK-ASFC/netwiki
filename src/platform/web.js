// NetWiki — couche « plateforme » pour la version web / mobile (Android, iOS via Capacitor).
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
//
// Remplace le pont Electron (preload.js) par une implémentation sans accès disque :
// le contenu livré est lu dans content.json et les modifications de l'utilisateur sont conservées
// localement dans IndexedDB (aucune donnée ne quitte l'appareil).

window.NETWIKI_ASSET_BASE = './dist/';
// Images des articles (dossiers _assets) : copiées dans www/content/ lors de la construction mobile.
window.NETWIKI_ASSET_URL = (rel) => './content/' + rel.split('/').map(encodeURIComponent).join('/');

const VERSION = '__NETWIKI_VERSION__';
const SETTINGS_KEY = 'netwiki.settings';
const DEFAULTS = {
  theme: 'dark', accent: '#6366f1', fontSize: 16, readingWidth: 'normal', effects: true, sidebarMode: 'tree',
  sidebarWidth: 300, showToc: true, expanded: [], favorites: [], recent: [],
  sidebarHidden: matchMedia('(max-width: 760px)').matches,
};

// ------------------------------------------------------------------ stockage local (IndexedDB)

const idb = (() => {
  let dbp = null;
  const db = () =>
    (dbp ||= new Promise((resolve, reject) => {
      const r = indexedDB.open('netwiki', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    }));
  const tx = async (mode, fn) => {
    const d = await db();
    return new Promise((resolve, reject) => {
      const t = d.transaction('kv', mode);
      const req = fn(t.objectStore('kv'));
      t.oncomplete = () => resolve(req?.result);
      t.onerror = () => reject(t.error);
    });
  };
  return { get: (k) => tx('readonly', (s) => s.get(k)), set: (k, v) => tx('readwrite', (s) => s.put(v, k)) };
})();

let base = null; // { files: { chemin: texte } }
let overlay = null; // { files: { chemin: texte }, mtimes: {}, deleted: [], folders: { chemin: meta } }

async function loadBase() {
  if (!base) base = await (await fetch('./content.json')).json();
  if (!overlay) overlay = (await idb.get('overlay')) || { files: {}, mtimes: {}, deleted: [], folders: {} };
}
const saveOverlay = () => idb.set('overlay', overlay);

function allFiles() {
  const deleted = new Set(overlay.deleted);
  const files = new Map();
  for (const [p, t] of Object.entries(base.files)) if (!deleted.has(p)) files.set(p, { raw: t, mtime: base.built });
  for (const [p, t] of Object.entries(overlay.files)) files.set(p, { raw: t, mtime: overlay.mtimes[p] || Date.now() });
  return files;
}

function slugify(text) {
  return (String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'sans-titre');
}

function buildTree() {
  const files = allFiles();
  const root = { type: 'folder', path: '', name: '', meta: {}, children: [] };
  const folders = new Map([['', root]]);
  const folderOf = (p) => {
    if (folders.has(p)) return folders.get(p);
    const parent = folderOf(p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '');
    const node = { type: 'folder', path: p, name: p.split('/').pop(), meta: {}, children: [] };
    parent.children.push(node);
    folders.set(p, node);
    return node;
  };
  for (const p of Object.keys(overlay.folders)) folderOf(p);
  for (const [p, f] of files) {
    const dir = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '';
    const name = p.split('/').pop();
    if (dir.split('/').some((s) => s.startsWith('.') || s.startsWith('_'))) continue;
    if (name === '_folder.json') {
      try {
        folderOf(dir).meta = JSON.parse(f.raw);
      } catch {}
    } else if (name.endsWith('.md') && !name.startsWith('_') && !name.startsWith('.')) {
      folderOf(dir).children.push({ type: 'page', path: p, name, raw: f.raw, mtime: f.mtime, size: f.raw.length });
    }
  }
  for (const [p, meta] of Object.entries(overlay.folders)) folderOf(p).meta = meta;
  return root;
}

function exists(p) {
  return allFiles().has(p) || Object.prototype.hasOwnProperty.call(overlay.folders, p) || [...allFiles().keys()].some((k) => k.startsWith(p + '/'));
}
function unique(dir, b, ext = '') {
  const join = (n) => (dir ? `${dir}/${n}` : n);
  let c = join(b + ext);
  for (let i = 2; exists(c); i++) c = join(`${b}-${i}${ext}`);
  return c;
}
function writeFile(p, raw) {
  overlay.files[p] = raw;
  overlay.mtimes[p] = Date.now();
  overlay.deleted = overlay.deleted.filter((d) => d !== p);
}
function deletePath(p) {
  for (const k of [...allFiles().keys()]) {
    if (k === p || k.startsWith(p + '/')) {
      delete overlay.files[k];
      if (base.files[k] !== undefined && !overlay.deleted.includes(k)) overlay.deleted.push(k);
    }
  }
  for (const k of Object.keys(overlay.folders)) if (k === p || k.startsWith(p + '/')) delete overlay.folders[k];
}

function openUrl(url) {
  const Browser = window.Capacitor?.Plugins?.Browser;
  if (Browser) Browser.open({ url });
  else window.open(url, '_blank', 'noopener');
}

const indisponible = () => Promise.reject(new Error('Fonction disponible dans la version de bureau (Windows, macOS, Linux).'));

async function attributionOk() {
  try {
    return /^MIT License\s+Copyright \(c\) 2026 JK-ASFC/m.test(await (await fetch('./LICENSE.txt')).text());
  } catch {
    return false;
  }
}

window.netwiki = {
  platform: window.Capacitor?.getPlatform?.() || 'web',
  info: async () => ({
    version: VERSION, dataDir: "Stockage interne de l'application", platform: window.Capacitor?.getPlatform?.() || 'web',
    electron: '—', automation: false, owner: 'JK-ASFC', attributionOk: await attributionOk(),
  }),
  getSettings: async () => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
    } catch {
      return { ...DEFAULTS };
    }
  },
  setSettings: async (patch) => {
    let s = {};
    try {
      s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    } catch {}
    const next = { ...s, ...patch };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {}
    return next;
  },
  setTitleBar: async () => {},

  load: async () => {
    await loadBase();
    return buildTree();
  },
  write: async (rel, content) => {
    if (!rel.endsWith('.md')) throw new Error('Seuls les fichiers .md sont modifiables.');
    writeFile(rel, content);
    await saveOverlay();
    return { path: rel, mtime: overlay.mtimes[rel] };
  },
  createPage: async (folderRel, title, content) => {
    const p = unique(folderRel, slugify(title), '.md');
    writeFile(p, content);
    await saveOverlay();
    return p;
  },
  createFolder: async (parentRel, meta) => {
    const p = unique(parentRel, slugify(meta.title));
    overlay.folders[p] = meta;
    await saveOverlay();
    return p;
  },
  setFolderMeta: async (rel, meta) => {
    overlay.folders[rel] = meta;
    await saveOverlay();
  },
  move: async (rel, target) => {
    if (target === rel || target.startsWith(rel + '/')) throw new Error('Impossible de déplacer un dossier dans lui-même.');
    const name = rel.split('/').pop();
    const isPage = rel.endsWith('.md');
    const dest = unique(target, isPage ? name.slice(0, -3) : name, isPage ? '.md' : '');
    for (const [k, f] of allFiles()) if (k === rel || k.startsWith(rel + '/')) writeFile(dest + k.slice(rel.length), f.raw);
    for (const [k, m] of Object.entries(overlay.folders)) if (k === rel || k.startsWith(rel + '/')) overlay.folders[dest + k.slice(rel.length)] = m;
    deletePath(rel);
    await saveOverlay();
    return dest;
  },
  duplicate: async (rel) => {
    const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '';
    const p = unique(dir, rel.split('/').pop().slice(0, -3) + '-copie', '.md');
    writeFile(p, allFiles().get(rel)?.raw || '');
    await saveOverlay();
    return p;
  },
  remove: async (rel) => {
    deletePath(rel);
    await saveOverlay();
  },
  saveAsset: indisponible,
  reveal: async () => {},
  openDataDir: async () => {},
  chooseDataDir: async () => null,
  resetDataDir: async () => "Stockage interne de l'application",
  restoreSeeds: async () => {
    const n = overlay.deleted.length;
    overlay.deleted = [];
    await saveOverlay();
    return n;
  },
  exportPdf: async () => {
    window.print();
    return null;
  },
  openExternal: async (url) => {
    if (/^(https?|mailto):/i.test(url)) openUrl(url);
  },

  exportPack: indisponible,
  choosePack: indisponible,
  applyPack: indisponible,
  contentInfo: async () => ({ version: '', source: '', label: '', updated: '' }),
  // Version web / mobile : le contenu est livré avec l'application (mises à jour par les magasins d'applications).
  checkUpdates: async () => {
    const res = await fetch('https://api.github.com/repos/JK-ASFC/netwiki/releases/latest', { headers: { Accept: 'application/vnd.github+json' } });
    if (res.status === 404) throw new Error('Aucune version publiée pour le moment.');
    if (!res.ok) throw new Error(`GitHub a répondu ${res.status}.`);
    const rel = await res.json();
    const latest = String(rel.tag_name || '').replace(/^v/i, '');
    const cmp = (a, b) => {
      const pa = a.split('.').map(Number);
      const pb = b.split('.').map(Number);
      for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
      return 0;
    };
    const app = { current: VERSION, latest, newer: !!latest && cmp(latest, VERSION) > 0, notes: String(rel.body || '').slice(0, 4000), page: rel.html_url || 'https://github.com/JK-ASFC/netwiki/releases', selfUpdate: null };
    return { app, appError: null, content: null, contentError: null };
  },
  downloadContent: indisponible,
  installAppUpdate: indisponible,
  openReleasePage: async (url) => {
    if (/^https:\/\/github\.com\//i.test(url)) openUrl(url);
  },

  onChanged: () => {},
};

// Sur petit écran, le panneau latéral se referme après le choix d'un article.
document.addEventListener('click', (e) => {
  if (matchMedia('(max-width: 760px)').matches && e.target.closest?.('#sb-scroll .tree-row.is-page, #sb-scroll .flat-row, #sb-scroll [data-page]')) {
    document.body.classList.add('sidebar-hidden');
  }
});
