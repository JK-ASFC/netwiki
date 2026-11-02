// NetWiki — couche « plateforme » pour la version web / mobile (Android, iOS via Capacitor).
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
//
// Remplace le pont Electron (preload.js) par une implémentation sans accès disque :
// le contenu livré est lu dans content.json et les modifications de l'utilisateur sont conservées
// localement dans IndexedDB (aucune donnée ne quitte l'appareil).

import { ed25519 } from '@noble/curves/ed25519';

window.NETWIKI_ASSET_BASE = './dist/';
// Images des articles (dossiers _assets) : copiées dans www/content/ lors de la construction mobile ;
// celles reçues par une mise à jour du wiki sont lues dans IndexedDB (adresses blob:).
const packImageUrls = new Map();
window.NETWIKI_ASSET_URL = (rel) => packImageUrls.get(rel) || './content/' + rel.split('/').map(encodeURIComponent).join('/');

// Module natif Android (mobile/android/…/NetWikiPlugin.java) : absent dans un navigateur ou sous iOS.
const native = () => window.Capacitor?.Plugins?.NetWiki || null;
const PLATFORM = window.Capacitor?.getPlatform?.() || 'web';
const REPO = 'JK-ASFC/netwiki';
const CONTENT_BASE = `https://raw.githubusercontent.com/${REPO}/contenu`;
// Clé publique Ed25519 de JK-ASFC (mêmes paquets et listes signées que la version de bureau, voir main/pack.js).
const PUBLIC_KEY_SPKI = 'MCowBQYDK2VwAyEAT4XlvzK8xlul2N+ue973/eYUyR0QR6vqomGZnU/iPLk=';

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

// Trois couches, de la plus basse à la plus haute :
//  - base    : contenu livré avec l'application (content.json) ;
//  - pack    : articles officiels reçus depuis (mises à jour hebdomadaires du wiki, signées par JK-ASFC) ;
//  - overlay : modifications de l'utilisateur (jamais écrasées par une mise à jour).
let base = null; // { version, contentVersion, built, files: { chemin: texte }, images: { chemin: sha1 } }
let pack = null; // { version, label, source, updated, files: { chemin: texte }, images: { chemin: Blob }, sums: { chemin: sha1 } }
let overlay = null; // { files: { chemin: texte }, mtimes: {}, deleted: [], folders: { chemin: meta } }

const cmpVersion = (a, b) => {
  const pa = String(a).split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
};

async function loadBase() {
  if (!base) base = await (await fetch('./content.json')).json();
  if (!overlay) overlay = (await idb.get('overlay')) || { files: {}, mtimes: {}, deleted: [], folders: {} };
  if (!pack) {
    pack = (await idb.get('pack').catch(() => null)) || null;
    // Application mise à jour avec un contenu plus récent que la dernière mise à jour du wiki : celle-ci est retirée.
    if (pack && base.contentVersion && pack.version && cmpVersion(base.contentVersion, pack.version) >= 0) {
      pack = null;
      await idb.set('pack', null);
    }
    pack ||= { version: '', label: '', source: '', updated: '', files: {}, images: {}, sums: {} };
    for (const u of packImageUrls.values()) URL.revokeObjectURL(u);
    packImageUrls.clear();
    for (const [rel, blob] of Object.entries(pack.images || {})) if (blob instanceof Blob) packImageUrls.set(rel, URL.createObjectURL(blob));
  }
}
const saveOverlay = () => idb.set('overlay', overlay);

/** Texte officiel actuel d'un fichier (mise à jour du wiki, sinon contenu livré). */
const officialText = (p) => (pack.files[p] !== undefined ? pack.files[p] : base.files[p]);

function allFiles() {
  const deleted = new Set(overlay.deleted);
  const files = new Map();
  const built = base.built;
  const packTime = pack.updated ? Date.parse(pack.updated) : built;
  for (const [p, t] of Object.entries(base.files)) if (!deleted.has(p)) files.set(p, { raw: t, mtime: built });
  for (const [p, t] of Object.entries(pack.files)) if (!deleted.has(p)) files.set(p, { raw: t, mtime: packTime });
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
      if (officialText(k) !== undefined && !overlay.deleted.includes(k)) overlay.deleted.push(k);
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

// ------------------------------------------------------------------ signatures (Ed25519, clé publique de JK-ASFC)

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const PUBLIC_KEY = b64(PUBLIC_KEY_SPKI).slice(-32);
const utf8 = new TextDecoder();

function verify(payload, signature) {
  try {
    return ed25519.verify(b64(signature), payload, PUBLIC_KEY);
  } catch {
    return false;
  }
}

/** Document signé (liste des empreintes d'une version) : même format que main/pack.js (readSignedDocument). */
function readSignedDocument(text) {
  let outer;
  try {
    outer = JSON.parse(text);
  } catch {
    throw new Error('Document de mise à jour illisible.');
  }
  if (outer?.format !== 'netwiki-signed' || outer.version !== 1 || typeof outer.payload !== 'string' || typeof outer.signature !== 'string') {
    throw new Error('Document de mise à jour non signé ou de format inconnu.');
  }
  const payload = b64(outer.payload);
  if (!verify(payload, outer.signature)) throw new Error('Signature invalide : la mise à jour a été modifiée ou ne provient pas de JK-ASFC.');
  return JSON.parse(utf8.decode(payload));
}

async function sha1(bytes) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-1', bytes))].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function gunzip(bytes) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Mettez à jour « Android System WebView » (Play Store) pour installer les mises à jour du wiki.');
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// ------------------------------------------------------------------ paquets de contenu (.netwiki)

const IMAGE_MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', avif: 'image/avif' };
const pendingImports = new Map();

function isAllowedPath(rel) {
  if (typeof rel !== 'string' || !rel || rel.length > 400 || rel.includes('\\') || rel.includes('\0') || rel.startsWith('/')) return false;
  const parts = rel.split('/');
  if (parts.some((p) => !p || p === '.' || p === '..' || p.startsWith('.'))) return false;
  const name = parts[parts.length - 1];
  if (name.endsWith('.md') || name === '_folder.json') return true;
  return parts.includes('_assets') && !!IMAGE_MIME[name.split('.').pop().toLowerCase()];
}

/** Lit et vérifie un paquet ; même format et mêmes règles que main/pack.js (readPack). */
async function readPack(text, { requireSignature }) {
  let outer;
  try {
    outer = JSON.parse(text);
  } catch {
    throw new Error("Ce fichier n'est pas un paquet NetWiki.");
  }
  if (outer?.format !== 'netwiki-pack' || outer.version !== 1 || typeof outer.payload !== 'string') {
    throw new Error("Format de paquet NetWiki inconnu ou d'une version plus récente.");
  }
  const payload = b64(outer.payload);
  let signed = false;
  if (outer.signature) {
    if (!verify(payload, outer.signature)) throw new Error('Signature invalide : le paquet a été modifié ou ne provient pas de JK-ASFC.');
    signed = true;
  } else if (requireSignature) {
    throw new Error('Paquet non signé : les mises à jour en ligne doivent être signées par JK-ASFC.');
  }
  let inner;
  try {
    inner = JSON.parse(utf8.decode(await gunzip(payload)));
  } catch (err) {
    throw new Error(err.message?.includes('WebView') ? err.message : 'Contenu du paquet illisible ou corrompu.');
  }
  const files = new Map();
  for (const [rel, data] of Object.entries(inner?.files || {})) {
    if (!isAllowedPath(rel)) throw new Error(`Chemin refusé dans le paquet : ${rel}`);
    files.set(rel, b64(String(data)));
  }
  if (!files.size) throw new Error('Le paquet ne contient aucun fichier.');
  return {
    signed,
    files,
    meta: {
      appVersion: String(inner.appVersion || ''),
      contentVersion: String(inner.contentVersion || inner.appVersion || ''),
      created: String(inner.created || ''),
      label: String(inner.label || ''),
    },
  };
}

/** Récapitulatif lisible (catégorie, service, titre), comme describeChanges dans main.js. */
function describeChanges(files, plan) {
  const folderTitle = (dir) => {
    let raw = files.has(`${dir}/_folder.json`) ? utf8.decode(files.get(`${dir}/_folder.json`)) : allFiles().get(`${dir}/_folder.json`)?.raw;
    try {
      return String(JSON.parse(raw).title || '') || dir.split('/').pop().replace(/^\d+-/, '');
    } catch {
      return dir.split('/').pop().replace(/^\d+-/, '');
    }
  };
  const describe = (rel) => {
    const parts = rel.split('/');
    let title = parts[parts.length - 1];
    if (rel.endsWith('.md')) {
      const m = /^title:\s*(.+)$/m.exec(utf8.decode(files.get(rel)).slice(0, 3000));
      if (m) title = m[1].trim().replace(/^["']|["']$/g, '');
    }
    return {
      path: rel,
      title: title.slice(0, 160),
      category: parts.length > 1 ? folderTitle(parts[0]) : 'Accueil',
      service: parts.length > 2 && parts[1] !== '_assets' ? folderTitle(parts.slice(0, 2).join('/')) : '',
      kind: rel.endsWith('.md') ? 'article' : 'image',
    };
  };
  const list = (rels) => rels.filter((r) => !r.endsWith('_folder.json')).slice(0, 500).map(describe);
  return { add: list(plan.add), update: list(plan.update) };
}

/**
 * Prépare l'import sans rien écrire : nouveau fichier → ajouté ; fichier officiel non modifié → mis à jour ;
 * fichier modifié par l'utilisateur → conservé ; fichier supprimé par l'utilisateur → non recréé.
 */
async function prepareImport(text, { requireSignature, source }) {
  await loadBase();
  const p = await readPack(text, { requireSignature });
  const plan = { add: [], update: [], same: [], keep: [], skipDeleted: [] };
  const deleted = new Set(overlay.deleted);
  for (const [rel, data] of p.files) {
    if (deleted.has(rel)) {
      plan.skipDeleted.push(rel);
      continue;
    }
    if (!rel.endsWith('.md') && !rel.endsWith('_folder.json')) {
      const sum = await sha1(data);
      const current = pack.sums?.[rel] || base.images?.[rel];
      (current === undefined ? plan.add : current === sum ? plan.same : plan.update).push(rel);
      continue;
    }
    const txt = utf8.decode(data);
    const official = officialText(rel);
    const mine = overlay.files[rel];
    if (mine !== undefined && mine !== official && mine !== txt) plan.keep.push(rel);
    else if (official === undefined && mine === undefined) plan.add.push(rel);
    else if ((mine ?? official) === txt) plan.same.push(rel);
    else plan.update.push(rel);
  }
  const token = crypto.randomUUID();
  pendingImports.clear();
  pendingImports.set(token, { files: p.files, plan, signed: p.signed, meta: p.meta, source });
  const counts = Object.fromEntries(Object.entries(plan).map(([k, v]) => [k, v.length]));
  return { token, signed: p.signed, meta: p.meta, counts, keepSample: plan.keep.slice(0, 8), details: describeChanges(p.files, plan) };
}

async function applyImport(token) {
  const pending = pendingImports.get(token);
  if (!pending) throw new Error('Import expiré : recommencez.');
  pendingImports.delete(token);
  await loadBase();
  const { files, plan, meta, signed, source } = pending;
  const isText = (rel) => rel.endsWith('.md') || rel.endsWith('_folder.json');
  for (const rel of [...plan.add, ...plan.update]) {
    const data = files.get(rel);
    if (isText(rel)) pack.files[rel] = utf8.decode(data);
    else {
      pack.images[rel] = new Blob([data], { type: IMAGE_MIME[rel.split('.').pop().toLowerCase()] });
      pack.sums[rel] = await sha1(data);
      if (packImageUrls.has(rel)) URL.revokeObjectURL(packImageUrls.get(rel));
      packImageUrls.set(rel, URL.createObjectURL(pack.images[rel]));
    }
  }
  // Article déjà modifié à l'identique par l'utilisateur : il redevient un article officiel.
  for (const rel of plan.same.filter(isText)) {
    const txt = utf8.decode(files.get(rel));
    if (officialText(rel) !== txt) pack.files[rel] = txt;
  }
  for (const rel of [...plan.add, ...plan.update, ...plan.same]) if (isText(rel) && overlay.files[rel] === officialText(rel)) delete overlay.files[rel];
  // Seul un paquet officiel (signé) fait avancer la version du contenu installé.
  if (signed && meta.contentVersion && cmpVersion(meta.contentVersion, pack.version || base.contentVersion || '0') > 0) {
    pack.version = meta.contentVersion;
    pack.label = meta.label;
    pack.source = source;
  }
  pack.updated = new Date().toISOString();
  await idb.set('pack', pack);
  await saveOverlay();
  return { added: plan.add.length, updated: plan.update.length, kept: plan.keep.length };
}

/** Sélection d'un fichier .netwiki sur l'appareil (gestionnaire de fichiers d'Android). */
function pickFile(accept) {
  return new Promise((resolve) => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept });
    input.style.display = 'none';
    input.onchange = () => resolve(input.files?.[0] || null);
    input.oncancel = () => resolve(null);
    document.body.append(input);
    input.click();
    setTimeout(() => input.remove(), 60000);
  });
}

// ------------------------------------------------------------------ mises à jour du logiciel (Android)

let lastRelease = null;
const progressListeners = new Set();
native()?.addListener?.('updateProgress', (p) => progressListeners.forEach((cb) => cb(p)));

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub a répondu ${res.status}.`);
  return res.json();
}

async function checkAppUpdate() {
  let rel;
  try {
    rel = await fetchJson(`https://api.github.com/repos/${REPO}/releases/latest`);
  } catch (err) {
    throw new Error(navigator.onLine === false ? 'Pas de connexion Internet.' : err.message || 'Connexion à GitHub impossible.');
  }
  if (!rel) throw new Error('Aucune version publiée pour le moment.');
  const latest = String(rel.tag_name || '').replace(/^v/i, '');
  const assets = (Array.isArray(rel.assets) ? rel.assets : []).filter((a) => a && typeof a.name === 'string' && typeof a.browser_download_url === 'string');
  const info = native() ? await native().getInfo().catch(() => null) : null;
  // Sur Android, la version de référence est celle de l'application installée.
  const current = info?.version || VERSION;
  // Mise à jour intégrée : version Android distribuée sur GitHub, si la version publiée fournit un APK.
  const apk = assets.find((a) => /^NetWiki-[\d.]+\.apk$/.test(a.name));
  const selfUpdate = info?.selfUpdate && apk && assets.some((a) => a.name === 'netwiki-update.json') ? 'android' : null;
  lastRelease = { latest, assets, apk };
  return {
    current,
    latest,
    newer: !!latest && cmpVersion(latest, current) > 0,
    notes: String(rel.body || '').slice(0, 4000),
    page: typeof rel.html_url === 'string' && rel.html_url.startsWith('https://github.com/') ? rel.html_url : `https://github.com/${REPO}/releases`,
    selfUpdate,
    size: apk?.size || 0,
  };
}

/** Télécharge l'APK, vérifie son empreinte dans la liste signée par JK-ASFC, puis ouvre l'installeur d'Android. */
async function installAppUpdate() {
  const n = native();
  if (!n || !lastRelease?.apk) throw new Error('Mise à jour automatique indisponible : utilisez la page de téléchargement.');
  const list = lastRelease.assets.find((a) => a.name === 'netwiki-update.json');
  const r = await n.httpGet({ url: list.browser_download_url, maxBytes: 2 * 1024 * 1024 });
  if (r.status !== 200) throw new Error('Liste signée introuvable pour cette version.');
  const doc = readSignedDocument(r.text);
  if (doc?.format !== 'netwiki-update' || String(doc.version) !== lastRelease.latest) throw new Error('Liste signée incohérente avec la version annoncée.');
  const expected = doc.files?.[lastRelease.apk.name];
  if (!expected || !/^[0-9a-f]{64}$/.test(String(expected.sha256))) throw new Error(`${lastRelease.apk.name} ne figure pas dans la liste signée.`);
  let file;
  try {
    file = await n.downloadUpdate({ url: lastRelease.apk.browser_download_url, sha256: expected.sha256, name: lastRelease.apk.name });
  } catch (err) {
    const e = new Error(err.message || String(err));
    e.code = err.code;
    throw e;
  }
  try {
    await n.installUpdate({ path: file.path });
  } catch (err) {
    const e = new Error(err.message || String(err));
    e.code = err.code;
    throw e;
  }
  return { mode: 'android' };
}

// ------------------------------------------------------------------ PDF et partage

async function exportPdf(title, { action = 'save' } = {}) {
  const n = native();
  if (!n) {
    window.print();
    return null;
  }
  if (action === 'print') {
    await n.printPage({ name: title });
    return { printed: true };
  }
  return n.savePdf({ name: title, action });
}

async function share({ title, text }) {
  const n = native();
  if (n) return n.shareText({ title, text, dialogTitle: 'Partager l’article' });
  if (navigator.share) return navigator.share({ title, text });
  await navigator.clipboard?.writeText(text);
  return { copied: true };
}

// ------------------------------------------------------------------ API exposée à l'interface

let appInfo = null;

window.netwiki = {
  platform: PLATFORM,
  info: async () => {
    appInfo = native() ? await native().getInfo().catch(() => null) : null;
    return {
      version: VERSION,
      dataDir: "Stockage interne de l'application",
      platform: PLATFORM,
      platformLabel: appInfo ? `Android ${appInfo.sdk >= 35 ? '15+' : `(API ${appInfo.sdk})`} · ${appInfo.device}` : PLATFORM,
      electron: '—',
      automation: false,
      owner: 'JK-ASFC',
      attributionOk: await attributionOk(),
      mobile: true,
      selfUpdate: !!appInfo?.selfUpdate,
      store: appInfo?.store || '',
    };
  },
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
  // Barres d'état et de navigation d'Android aux couleurs du thème de NetWiki.
  setTitleBar: async () => {
    const dark = document.documentElement.dataset.theme !== 'light';
    native()?.setSystemBars({ dark, color: dark ? '#0b0d14' : '#f4f5f9' }).catch(() => {});
  },

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
  exportPdf,
  share,
  openFile: async (uri) => native()?.openFile({ uri, mime: 'application/pdf' }),
  openExternal: async (url) => {
    if (/^(https?|mailto):/i.test(url)) openUrl(url);
  },

  // Paquets de contenu : import d'un fichier .netwiki (signé ou non) ; l'export reste réservé à la version de bureau.
  exportPack: indisponible,
  choosePack: async () => {
    const f = await pickFile('.netwiki,application/json,application/octet-stream');
    if (!f) return null;
    if (f.size > 200 * 1024 * 1024) throw new Error('Paquet trop volumineux.');
    return prepareImport(await f.text(), { requireSignature: false, source: 'fichier' });
  },
  applyPack: applyImport,
  contentInfo: async () => {
    await loadBase();
    return pack.version
      ? { version: pack.version, source: pack.source, label: pack.label, updated: pack.updated }
      : { version: base.contentVersion || '', source: 'application', label: '', updated: '' };
  },
  checkContentUpdate: async () => {
    await loadBase();
    const idx = await fetchJson(`${CONTENT_BASE}/contenu.json`);
    if (!idx) return null;
    if (idx.format !== 'netwiki-content-index' || typeof idx.version !== 'string' || !/^[\w.-]+\.netwiki$/.test(String(idx.file || ''))) {
      throw new Error('Index du contenu invalide.');
    }
    const installed = pack.version || base.contentVersion || '';
    lastContent = { ...idx, url: `${CONTENT_BASE}/${idx.file}` };
    return { installed, latest: idx.version, newer: !installed || cmpVersion(idx.version, installed) > 0, label: String(idx.label || ''), files: Number(idx.files) || 0, size: Number(idx.size) || 0 };
  },
  downloadContent: async () => {
    if (!lastContent) throw new Error('Recherchez d’abord une mise à jour du wiki.');
    const res = await fetch(lastContent.url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Téléchargement impossible (${res.status}).`);
    return prepareImport(await res.text(), { requireSignature: true, source: 'hebdomadaire' });
  },
  checkAppUpdate,
  installAppUpdate,
  onUpdateProgress: (cb) => progressListeners.add(cb),
  restartApp: async () => location.reload(),
  openReleasePage: async (url) => {
    if (/^https:\/\/github\.com\//i.test(url)) openUrl(url);
  },

  // Fonctions propres à Android (null dans un navigateur ou sous iOS).
  mobile: native()
    ? {
        getInfo: () => native().getInfo(),
        configureUpdates: (o) => native().configureUpdates(o),
        requestNotifications: async () => (await native().requestNotifications()).granted,
        openNotificationSettings: () => native().openNotificationSettings(),
        openInstallSettings: () => native().openInstallSettings(),
        consumeLaunchAction: async () => (await native().consumeLaunchAction()).action || null,
        onLaunchAction: (cb) => native().addListener('launchAction', (e) => cb(e.action)),
        onBack: (cb) => {
          native().addListener('backButton', cb);
          native().setBackHandler({ enabled: true });
        },
        exitApp: () => native().exitApp(),
      }
    : null,

  onChanged: () => {},
};
let lastContent = null;

// Sur petit écran, le panneau latéral se referme après le choix d'un article.
document.addEventListener('click', (e) => {
  if (matchMedia('(max-width: 760px)').matches && e.target.closest?.('#sb-scroll .tree-row.is-page, #sb-scroll .flat-row, #sb-scroll [data-page]')) {
    document.body.classList.add('sidebar-hidden');
  }
});
