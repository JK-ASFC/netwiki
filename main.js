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
const content = require('./main/content.js');
const updates = require('./main/updates.js');
const selfupdate = require('./main/selfupdate.js');

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
// Version datée du contenu livré (écrite par build.mjs) ; en développement, le contenu du projet est toujours appliqué.
const BUNDLED_CONTENT_VERSION = (() => {
  if (!app.isPackaged) return process.env.NETWIKI_AUTOMATION === '1' ? String(process.env.NETWIKI_TEST_CONTENT_VERSION || '') : '';
  try {
    return String(require('./dist/content-version.json').version || '');
  } catch {
    return '';
  }
})();
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');
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

// ---------------------------------------------------------------- contenu d'origine

/** Importe le contenu livré avec l'application s'il est plus récent que le contenu installé (voir main/content.js). */
function syncSeeds({ force = false } = {}) {
  return content.syncSeeds({ seedDir: SEED_DIR, dataRoot: dataDir(), bundledVersion: BUNDLED_CONTENT_VERSION, force });
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
let lastCheck = null;

/** Vérifie un paquet et prépare son import sans rien écrire ; le renderer confirme ensuite avec le jeton. */
async function prepareImport(buf, { requireSignature, source }) {
  const p = pack.readPack(buf, { requireSignature });
  const plan = await pack.planImport(p.files, dataDir(), await content.readManifest(dataDir()));
  const token = crypto.randomUUID();
  pendingImports.clear();
  pendingImports.set(token, { files: p.files, plan, signed: p.signed, meta: p.meta, source });
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
  return prepareImport(await fsp.readFile(file), { requireSignature: false, source: 'fichier' });
});

handle('pack:apply', async (token) => {
  const pending = pendingImports.get(token);
  if (!pending) throw new Error('Import expiré : recommencez.');
  pendingImports.delete(token);
  suppressWatchUntil = Date.now() + 15000;
  const root = dataDir();
  const manifest = await content.readManifest(root);
  const result = await pack.applyImport(pending.files, pending.plan, root, manifest);
  await content.writeManifest(root, manifest);
  // Seul un paquet officiel (signé) fait avancer la version du contenu installé.
  if (pending.signed) await content.recordContentVersion(root, { version: pending.meta.contentVersion, source: pending.source, label: pending.meta.label });
  return result;
});

handle('content:info', async () => content.readContentState(dataDir()));

/** Vérifie le logiciel (Release) et le contenu (branche « contenu ») ; mémorise le résultat pour les téléchargements. */
handle('updates:check', async () => {
  const installed = (await content.readContentState(dataDir())).version;
  const [a, c] = await Promise.allSettled([updates.checkApp(APP_VERSION), updates.checkContent(installed, APP_VERSION)]);
  if (a.status === 'rejected' && c.status === 'rejected') throw a.reason;
  lastCheck = { app: a.status === 'fulfilled' ? a.value : null, content: c.status === 'fulfilled' ? c.value : null };
  const appInfo = lastCheck.app && { ...lastCheck.app, assets: undefined, selfUpdate: selfupdate.mode() };
  return {
    app: appInfo,
    appError: a.status === 'rejected' ? a.reason.message : null,
    content: lastCheck.content && { ...lastCheck.content, url: undefined },
    contentError: c.status === 'rejected' ? c.reason.message : null,
  };
});

handle('updates:download-content', async () => {
  if (!lastCheck?.content) throw new Error('Vérifiez d’abord les mises à jour.');
  const buf = await updates.download(lastCheck.content.url, APP_VERSION, { maxBytes: updates.LIMITS.pack });
  return prepareImport(buf, { requireSignature: true, source: 'hebdomadaire' });
});

handle('updates:install-app', async () => {
  const rel = lastCheck?.app;
  if (!rel?.newer) throw new Error('Aucune nouvelle version à installer.');
  const progress = (received, total) => {
    if (win && !win.isDestroyed()) win.webContents.send('updates:progress', { received, total });
  };
  const r = await selfupdate.install(rel, APP_VERSION, progress);
  settings.cleanupFiles = [...(settings.cleanupFiles || []), r.cleanup].filter(Boolean);
  saveSettings();
  // Laisse au renderer le temps d'afficher « redémarrage », puis relance la nouvelle version (portable) ou laisse l'installeur faire.
  setTimeout(() => {
    if (r.relaunch) app.relaunch({ execPath: r.relaunch, args: [] });
    app.quit();
  }, 800);
  return { mode: r.mode };
});

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
  if (settings.cleanupFiles?.length) {
    settings.cleanupFiles = await selfupdate.cleanup(settings.cleanupFiles);
    saveSettings();
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
