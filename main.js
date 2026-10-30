// NetWiki — processus principal Electron
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
// Gère la fenêtre, le stockage local des articles (Markdown) et l'accès disque pour le renderer.

const { app, BrowserWindow, ipcMain, dialog, shell, protocol, net, Menu, nativeTheme, session } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const fsp = fs.promises;
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');
const pack = require('./main/pack.js');
const updates = require('./main/updates.js');

protocol.registerSchemesAsPrivileged([
  { scheme: 'wikifile', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
]);

const IS_MAC = process.platform === 'darwin';
// Propriété : l'attribution à JK-ASFC (licence MIT) est contrôlée au démarrage ; une copie dont la mention
// de copyright a été retirée est signalée à l'utilisateur. L'intégrité de l'archive de l'application est en outre
// vérifiée par Electron (fusible « embedded ASAR integrity ») dans les versions officielles.
const OWNER = 'JK-ASFC';
const ATTRIBUTION_OK = (() => {
  try {
    const lic = fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf8');
    return /^MIT License\s+Copyright \(c\) 2026 JK-ASFC/m.test(lic);
  } catch {
    return false;
  }
})();
const APP_VERSION = (() => {
  try {
    return require('./package.json').version;
  } catch {
    return app.getVersion();
  }
})();
const SEED_DIR = app.isPackaged ? path.join(process.resourcesPath, 'content') : path.join(__dirname, 'content');
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');
const SEED_MANIFEST = '.netwiki-seed.json';
const ASSETS_DIR = '_assets';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  accent: '#6366f1',
  fontSize: 16,
  readingWidth: 'normal',
  effects: true,
  sidebarMode: 'tree',
  sidebarWidth: 300,
  showToc: true,
  expanded: [],
  favorites: [],
  recent: [],
  dataDir: null,
  bounds: null,
  maximized: false,
};

let settings = loadSettings();
let win = null;
let watcher = null;
let suppressWatchUntil = 0;

// ---------------------------------------------------------------- settings

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
}

function dataDir() {
  return settings.dataDir || path.join(app.getPath('userData'), 'wiki');
}

// ---------------------------------------------------------------- helpers

function toPosix(p) {
  return p.split(path.sep).join('/');
}

/** Résout un chemin relatif au dossier de données en refusant toute sortie de ce dossier. */
function resolveInside(rel = '') {
  const root = path.resolve(dataDir());
  const full = path.resolve(root, rel);
  if (full !== root && !full.startsWith(root + path.sep)) throw new Error(`Chemin refusé : ${rel}`);
  return full;
}

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

function slugify(text) {
  return (
    String(text)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'sans-titre'
  );
}

async function exists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
}

async function uniquePath(dir, base, ext = '') {
  let candidate = path.join(dir, base + ext);
  let i = 2;
  while (await exists(candidate)) candidate = path.join(dir, `${base}-${i++}${ext}`);
  return candidate;
}

function markOwnWrite() {
  suppressWatchUntil = Date.now() + 1500;
}

async function walkFiles(dir, rel = '') {
  const out = [];
  for (const e of await fsp.readdir(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await walkFiles(path.join(dir, e.name), r)));
    else out.push(r);
  }
  return out;
}

// ---------------------------------------------------------------- contenu d'origine

/**
 * Importe le contenu livré avec l'application dans le dossier de données.
 * Un manifeste mémorise chaque fichier importé (et son empreinte) :
 *  - un fichier jamais importé est copié s'il n'existe pas ;
 *  - un fichier mis à jour dans une nouvelle version est remplacé seulement si l'utilisateur ne l'a pas modifié ;
 *  - un fichier supprimé ou déplacé par l'utilisateur n'est jamais recréé.
 */
async function syncSeeds({ force = false } = {}) {
  if (!(await exists(SEED_DIR))) return 0;
  const root = dataDir();
  await fsp.mkdir(root, { recursive: true });
  const manifestPath = path.join(root, SEED_MANIFEST);
  let manifest = {};
  try {
    manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf8'));
  } catch {}

  let imported = 0;
  for (const rel of await walkFiles(SEED_DIR)) {
    const seed = await fsp.readFile(path.join(SEED_DIR, rel));
    const seedHash = sha1(seed);
    const target = path.join(root, rel);
    const known = manifest[rel];
    const targetExists = await exists(target);

    if (!known || force) {
      if (!targetExists) {
        await fsp.mkdir(path.dirname(target), { recursive: true });
        await fsp.writeFile(target, seed);
        imported++;
      }
    } else if (known !== seedHash && targetExists) {
      const current = sha1(await fsp.readFile(target));
      if (current === known) {
        await fsp.writeFile(target, seed);
        imported++;
      }
    }
    manifest[rel] = seedHash;
  }
  await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  return imported;
}

// ---------------------------------------------------------------- lecture de l'arborescence

async function readFolderMeta(dirAbs) {
  try {
    return JSON.parse(await fsp.readFile(path.join(dirAbs, '_folder.json'), 'utf8'));
  } catch {
    return {};
  }
}

async function scanFolder(dirAbs, rel) {
  const node = { type: 'folder', path: rel, name: path.basename(dirAbs), meta: await readFolderMeta(dirAbs), children: [] };
  const entries = await fsp.readdir(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name.startsWith('_')) continue;
    const abs = path.join(dirAbs, e.name);
    const childRel = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      node.children.push(await scanFolder(abs, childRel));
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      const [raw, stat] = await Promise.all([fsp.readFile(abs, 'utf8'), fsp.stat(abs)]);
      node.children.push({ type: 'page', path: childRel, name: e.name, raw, mtime: stat.mtimeMs, size: stat.size });
    }
  }
  return node;
}

// ---------------------------------------------------------------- surveillance des modifications externes

function startWatcher() {
  stopWatcher();
  let timer = null;
  try {
    watcher = fs.watch(dataDir(), { recursive: true }, (_evt, file) => {
      if (Date.now() < suppressWatchUntil) return;
      if (file && toPosix(String(file)).split('/').some((s) => s.startsWith('.'))) return;
      clearTimeout(timer);
      timer = setTimeout(() => win?.webContents.send('wiki:changed'), 500);
    });
  } catch (err) {
    console.warn('Surveillance du dossier indisponible :', err.message);
  }
}

function stopWatcher() {
  watcher?.close();
  watcher = null;
}

// ---------------------------------------------------------------- IPC

// Seule la page principale de l'application (fichier local src/index.html) peut appeler le processus principal.
const INDEX_URL = pathToFileURL(path.join(__dirname, 'src', 'index.html')).toString();

function handle(channel, fn) {
  ipcMain.handle(channel, async (e, ...args) => {
    const url = e.senderFrame?.url || '';
    if (!win || e.sender !== win.webContents || url.split(/[?#]/)[0] !== INDEX_URL) {
      throw new Error(`Appel refusé (${channel}) : origine non autorisée.`);
    }
    return fn(...args);
  });
}

handle('app:info', async () => ({
  version: APP_VERSION,
  owner: OWNER,
  attributionOk: ATTRIBUTION_OK,
  dataDir: dataDir(),
  platform: process.platform,
  electron: process.versions.electron,
  automation: process.env.NETWIKI_AUTOMATION === '1',
}));

handle('settings:get', async () => settings);

handle('settings:set', async (patch) => {
  settings = { ...settings, ...patch };
  saveSettings();
  return settings;
});

handle('win:titlebar', async ({ color, symbolColor }) => {
  if (!IS_MAC && win && typeof win.setTitleBarOverlay === 'function') {
    try {
      win.setTitleBarOverlay({ color, symbolColor, height: 48 });
    } catch {}
  }
  nativeTheme.themeSource = settings.theme === 'system' ? 'system' : settings.theme;
});

handle('wiki:load', async () => {
  const root = dataDir();
  await fsp.mkdir(root, { recursive: true });
  return scanFolder(root, '');
});

handle('wiki:write', async (rel, content) => {
  const abs = resolveInside(rel);
  if (!abs.toLowerCase().endsWith('.md')) throw new Error('Seuls les fichiers .md sont modifiables.');
  markOwnWrite();
  await fsp.mkdir(path.dirname(abs), { recursive: true });
  await fsp.writeFile(abs, content, 'utf8');
  return { path: rel, mtime: (await fsp.stat(abs)).mtimeMs };
});

handle('wiki:create-page', async (folderRel, title, content) => {
  const dir = resolveInside(folderRel);
  await fsp.mkdir(dir, { recursive: true });
  const abs = await uniquePath(dir, slugify(title), '.md');
  markOwnWrite();
  await fsp.writeFile(abs, content, 'utf8');
  return toPosix(path.relative(dataDir(), abs));
});

handle('wiki:create-folder', async (parentRel, meta) => {
  const parent = resolveInside(parentRel);
  const abs = await uniquePath(parent, slugify(meta.title));
  markOwnWrite();
  await fsp.mkdir(abs, { recursive: true });
  await fsp.writeFile(path.join(abs, '_folder.json'), JSON.stringify(meta, null, 2), 'utf8');
  return toPosix(path.relative(dataDir(), abs));
});

handle('wiki:folder-meta', async (rel, meta) => {
  const abs = resolveInside(rel);
  markOwnWrite();
  await fsp.writeFile(path.join(abs, '_folder.json'), JSON.stringify(meta, null, 2), 'utf8');
});

handle('wiki:move', async (rel, targetFolderRel) => {
  const src = resolveInside(rel);
  const destDir = resolveInside(targetFolderRel);
  if (destDir === src || destDir.startsWith(src + path.sep)) throw new Error('Impossible de déplacer un dossier dans lui-même.');
  const ext = path.extname(src);
  const dest = await uniquePath(destDir, path.basename(src, ext), ext);
  markOwnWrite();
  await fsp.rename(src, dest);
  return toPosix(path.relative(dataDir(), dest));
});

handle('wiki:duplicate', async (rel) => {
  const src = resolveInside(rel);
  const dest = await uniquePath(path.dirname(src), path.basename(src, '.md') + '-copie', '.md');
  markOwnWrite();
  await fsp.copyFile(src, dest);
  return toPosix(path.relative(dataDir(), dest));
});

handle('wiki:delete', async (rel) => {
  const abs = resolveInside(rel);
  if (abs === path.resolve(dataDir())) throw new Error('Impossible de supprimer la racine.');
  markOwnWrite();
  try {
    await shell.trashItem(abs);
  } catch {
    // Pas de corbeille système disponible : on déplace dans .trash du dossier de données.
    const trash = path.join(dataDir(), '.trash', new Date().toISOString().replace(/[:.]/g, '-'));
    await fsp.mkdir(trash, { recursive: true });
    await fsp.rename(abs, path.join(trash, path.basename(abs)));
  }
});

handle('wiki:save-asset', async (pageRel, fileName, bytes) => {
  const pageAbs = resolveInside(pageRel);
  const dir = path.join(path.dirname(pageAbs), ASSETS_DIR);
  const ext = (path.extname(String(fileName)) || '.png').toLowerCase();
  // Pièces jointes : images et PDF uniquement (jamais d'exécutable ni de page HTML dans le dossier des données).
  if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif', '.pdf'].includes(ext)) throw new Error(`Type de fichier refusé : ${ext}`);
  if (Buffer.byteLength(bytes) > 50 * 1024 * 1024) throw new Error('Fichier trop volumineux (50 Mo au maximum).');
  await fsp.mkdir(dir, { recursive: true });
  const abs = await uniquePath(dir, slugify(path.basename(String(fileName), path.extname(String(fileName)))), ext);
  markOwnWrite();
  await fsp.writeFile(abs, Buffer.from(bytes));
  return toPosix(path.relative(path.dirname(pageAbs), abs));
});

handle('wiki:reveal', async (rel) => {
  shell.showItemInFolder(resolveInside(rel));
});

handle('wiki:open-data-dir', async () => {
  await shell.openPath(dataDir());
});

handle('wiki:choose-data-dir', async () => {
  const res = await dialog.showOpenDialog(win, {
    title: 'Choisir le dossier des données NetWiki',
    properties: ['openDirectory', 'createDirectory'],
  });
  if (res.canceled || !res.filePaths[0]) return null;
  settings.dataDir = res.filePaths[0];
  saveSettings();
  await syncSeeds();
  startWatcher();
  return settings.dataDir;
});

handle('wiki:reset-data-dir', async () => {
  settings.dataDir = null;
  saveSettings();
  await syncSeeds();
  startWatcher();
  return dataDir();
});

handle('wiki:restore-seeds', async () => {
  markOwnWrite();
  return syncSeeds({ force: true });
});

handle('wiki:export-pdf', async (title) => {
  const res = await dialog.showSaveDialog(win, {
    title: 'Exporter en PDF',
    defaultPath: `${slugify(title)}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (res.canceled || !res.filePath) return null;
  const pdf = await win.webContents.printToPDF({ printBackground: true, pageSize: 'A4', margins: { marginType: 'default' } });
  await fsp.writeFile(res.filePath, pdf);
  shell.openPath(res.filePath);
  return res.filePath;
});

handle('shell:open-external', async (url) => {
  if (/^(https?|mailto):/i.test(url)) await shell.openExternal(url);
});

// ---------------------------------------------------------------- paquets de contenu et mises à jour

const pendingImports = new Map();

async function readManifest() {
  try {
    return JSON.parse(await fsp.readFile(path.join(dataDir(), SEED_MANIFEST), 'utf8'));
  } catch {
    return {};
  }
}

/** Vérifie un paquet et prépare son import sans rien écrire ; le renderer confirme ensuite avec le jeton. */
async function prepareImport(buf, { requireSignature }) {
  const p = pack.readPack(buf, { requireSignature });
  const plan = await pack.planImport(p.files, dataDir(), await readManifest());
  const token = crypto.randomUUID();
  pendingImports.clear();
  pendingImports.set(token, { files: p.files, plan });
  const counts = Object.fromEntries(Object.entries(plan).map(([k, v]) => [k, v.length]));
  return { token, signed: p.signed, meta: p.meta, counts, keepSample: plan.keep.slice(0, 8) };
}

handle('pack:export', async () => {
  const res = await dialog.showSaveDialog(win, {
    title: 'Exporter un paquet de contenu NetWiki',
    defaultPath: `netwiki-contenu-${new Date().toISOString().slice(0, 10)}.netwiki`,
    filters: [{ name: 'Paquet NetWiki', extensions: ['netwiki'] }],
  });
  if (res.canceled || !res.filePath) return null;
  const { buffer, count } = await pack.buildPack(dataDir(), { appVersion: APP_VERSION, label: 'Export local NetWiki' });
  await fsp.writeFile(res.filePath, buffer);
  return { path: res.filePath, count };
});

handle('pack:choose', async () => {
  const res = await dialog.showOpenDialog(win, {
    title: 'Importer un paquet de contenu NetWiki',
    properties: ['openFile'],
    filters: [{ name: 'Paquet NetWiki', extensions: ['netwiki'] }],
  });
  if (res.canceled || !res.filePaths[0]) return null;
  const file = res.filePaths[0];
  if ((await fsp.stat(file)).size > 200 * 1024 * 1024) throw new Error('Paquet trop volumineux.');
  return prepareImport(await fsp.readFile(file), { requireSignature: false });
});

handle('pack:apply', async (token) => {
  const pending = pendingImports.get(token);
  if (!pending) throw new Error('Import expiré : recommencez.');
  pendingImports.delete(token);
  suppressWatchUntil = Date.now() + 15000;
  const manifest = await readManifest();
  const result = await pack.applyImport(pending.files, pending.plan, dataDir(), manifest);
  await fsp.writeFile(path.join(dataDir(), SEED_MANIFEST), JSON.stringify(manifest, null, 2), 'utf8');
  return result;
});

handle('updates:check', async () => updates.checkLatest(APP_VERSION));

handle('updates:download-pack', async (url) => prepareImport(await updates.downloadPack(url, APP_VERSION), { requireSignature: true }));

handle('updates:open-page', async (url) => {
  if (/^https:\/\/github\.com\//i.test(url)) await shell.openExternal(url);
});

// ---------------------------------------------------------------- fenêtre

function createWindow() {
  const b = settings.bounds || {};
  win = new BrowserWindow({
    width: b.width || 1440,
    height: b.height || 900,
    x: b.x,
    y: b.y,
    minWidth: 960,
    minHeight: 600,
    show: false,
    title: 'NetWiki',
    backgroundColor: settings.theme === 'light' ? '#f5f6fa' : '#0b0d14',
    titleBarStyle: 'hidden',
    titleBarOverlay: IS_MAC ? false : { color: '#00000000', symbolColor: '#c9cdd8', height: 48 },
    trafficLightPosition: { x: 18, y: 17 },
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // Linux : le correcteur télécharge ses dictionnaires sur Internet ; désactivé pour qu'aucune requête ne parte sans accord.
      spellcheck: process.platform !== 'linux',
      // Outils de développement réservés au mode développement (ou activés volontairement dans settings.json).
      devTools: !app.isPackaged || settings.devTools === true,
    },
  });

  if (settings.maximized) win.maximize();
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', () => {
    // Avec l'écran de démarrage : la fenêtre principale apparaît après une durée minimale, puis l'écran se ferme.
    const wait = splash ? Math.max(0, SPLASH_MIN_MS - (Date.now() - splashStart)) : 0;
    setTimeout(() => {
      if (!win) return;
      win.show();
      if (splash) splash.close();
    }, wait);
  });

  const persistBounds = () => {
    if (!win || win.isMinimized()) return;
    settings.maximized = win.isMaximized();
    if (!settings.maximized) settings.bounds = win.getBounds();
    saveSettings();
  };
  win.on('close', persistBounds);

  // Les liens externes s'ouvrent dans le navigateur par défaut, jamais dans l'application.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (url !== win.webContents.getURL()) {
      e.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  // Raccourcis hors menu (Windows / Linux) : outils de dev et zoom.
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    const mod = input.control || input.meta;
    if (input.key === 'F12' || (mod && input.shift && input.key.toLowerCase() === 'i')) {
      win.webContents.toggleDevTools();
      e.preventDefault();
    } else if (mod && (input.key === '=' || input.key === '+')) {
      win.webContents.setZoomLevel(Math.min(win.webContents.getZoomLevel() + 0.5, 4));
      e.preventDefault();
    } else if (mod && input.key === '-') {
      win.webContents.setZoomLevel(Math.max(win.webContents.getZoomLevel() - 0.5, -3));
      e.preventDefault();
    } else if (mod && input.key === '0') {
      win.webContents.setZoomLevel(0);
      e.preventDefault();
    }
  });

  win.on('closed', () => {
    win = null;
  });
}

// ---------------------------------------------------------------- écran de démarrage

const SPLASH_MIN_MS = 2800;
let splash = null;
let splashStart = 0;

function createSplash() {
  splashStart = Date.now();
  splash = new BrowserWindow({
    width: 760,
    height: 440,
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    center: true,
    show: false,
    title: 'NetWiki',
    backgroundColor: '#04070d',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  splash.loadFile(path.join(__dirname, 'src', 'splash.html'), { query: { v: APP_VERSION } });
  splash.once('ready-to-show', () => splash?.show());
  splash.webContents.on('will-navigate', (e) => e.preventDefault());
  splash.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  splash.on('closed', () => {
    splash = null;
    if (win && !win.isVisible()) win.show();
  });
}

function buildMenu() {
  if (!IS_MAC) {
    Menu.setApplicationMenu(null);
    return;
  }
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([{ role: 'appMenu' }, { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }])
  );
}

app.whenReady().then(async () => {
  // Aucune permission sensible (caméra, micro, position, notifications…) : seule la copie dans le presse-papiers est permise.
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => callback(permission === 'clipboard-sanitized-write'));
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => permission === 'clipboard-sanitized-write');

  protocol.handle('wikifile', (request) => {
    const url = new URL(request.url);
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    try {
      return net.fetch(pathToFileURL(resolveInside(rel)).toString());
    } catch {
      return new Response('Not found', { status: 404 });
    }
  });

  const automation = process.env.NETWIKI_AUTOMATION === '1';
  if (!ATTRIBUTION_OK && !automation) {
    dialog.showMessageBoxSync({
      type: 'warning',
      title: 'NetWiki — copie modifiée',
      message: 'La mention de copyright de JK-ASFC a été retirée ou altérée.',
      detail: "NetWiki est distribué sous licence MIT : toute copie doit conserver la mention « Copyright (c) 2026 JK-ASFC » et le texte de la licence. Téléchargez la version officielle sur https://github.com/JK-ASFC/netwiki.",
    });
  }
  if (settings.showSplash !== false && (!automation || process.env.NETWIKI_FORCE_SPLASH === '1')) createSplash();

  try {
    await syncSeeds();
  } catch (err) {
    console.error('Import du contenu initial impossible :', err);
  }

  buildMenu();
  createWindow();
  startWatcher();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopWatcher();
  if (!IS_MAC) app.quit();
});
