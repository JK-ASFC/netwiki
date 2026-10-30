// NetWiki — vérification des mises à jour en ligne (GitHub de JK-ASFC), uniquement avec l'accord de l'utilisateur.
//  - logiciel : dernière Release de github.com/JK-ASFC/netwiki ;
//  - contenu : paquet d'articles signé, publié chaque semaine sur la branche « contenu » du dépôt.
// Aucune donnée personnelle n'est envoyée : de simples requêtes HTTPS anonymes vers GitHub.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const { net } = require('electron');
const { compareVersions } = require('./content.js');

const REPO = 'JK-ASFC/netwiki';
// Tests automatisés uniquement : un serveur local remplace GitHub (les signatures restent exigées).
const TEST_BASE =
  process.env.NETWIKI_AUTOMATION === '1' && /^http:\/\/127\.0\.0\.1:\d+$/.test(process.env.NETWIKI_UPDATE_BASE || '') ? process.env.NETWIKI_UPDATE_BASE : null;
const API_LATEST = TEST_BASE ? `${TEST_BASE}/releases/latest` : `https://api.github.com/repos/${REPO}/releases/latest`;
const CONTENT_BASE = TEST_BASE ? `${TEST_BASE}/contenu` : `https://raw.githubusercontent.com/${REPO}/contenu`;
const ALLOWED_DOWNLOAD_HOSTS = new Set(['github.com', 'objects.githubusercontent.com', 'release-assets.githubusercontent.com', 'raw.githubusercontent.com']);
const LIMITS = { json: 2 * 1024 * 1024, pack: 200 * 1024 * 1024, app: 600 * 1024 * 1024 };

function checkUrl(url) {
  if (TEST_BASE && url.startsWith(TEST_BASE + '/')) return;
  const u = new URL(url);
  if (u.protocol !== 'https:' || !ALLOWED_DOWNLOAD_HOSTS.has(u.hostname)) throw new Error('Adresse de téléchargement refusée.');
}

const headers = (version, accept) => ({ Accept: accept, 'User-Agent': `NetWiki/${version}`, 'X-GitHub-Api-Version': '2022-11-28' });

/** Télécharge un fichier (hôte et taille contrôlés), avec progression facultative `onProgress(reçu, total)`. */
async function download(url, version, { maxBytes = LIMITS.pack, onProgress = null } = {}) {
  checkUrl(url);
  const res = await net.fetch(url, { headers: headers(version, 'application/octet-stream'), cache: 'no-store' });
  if (!res.ok) throw new Error(`Téléchargement impossible (${res.status}).`);
  const total = Number(res.headers.get('content-length') || 0);
  if (total > maxBytes) throw new Error('Fichier trop volumineux.');
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  let last = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;
    if (received > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new Error('Fichier trop volumineux.');
    }
    chunks.push(Buffer.from(value));
    if (onProgress && Date.now() - last > 250) {
      last = Date.now();
      onProgress(received, total);
    }
  }
  if (onProgress) onProgress(received, total);
  return Buffer.concat(chunks);
}

/** Dernière version du logiciel publiée (Release GitHub) et ses fichiers. */
async function checkApp(currentVersion) {
  const res = await net.fetch(API_LATEST, { headers: headers(currentVersion, 'application/vnd.github+json'), cache: 'no-store' });
  if (res.status === 404) throw new Error(`Aucune version publiée pour le moment sur github.com/${REPO}.`);
  if (!res.ok) throw new Error(`GitHub a répondu ${res.status}.`);
  const rel = await res.json();
  const latest = String(rel.tag_name || rel.name || '').replace(/^v/i, '');
  const assets = (Array.isArray(rel.assets) ? rel.assets : [])
    .filter((a) => a && typeof a.name === 'string' && typeof a.browser_download_url === 'string')
    .map((a) => ({ name: a.name, url: a.browser_download_url, size: Number(a.size) || 0 }));
  return {
    current: currentVersion,
    latest,
    newer: !!latest && compareVersions(latest, currentVersion) > 0,
    notes: String(rel.body || '').slice(0, 4000),
    page: typeof rel.html_url === 'string' && rel.html_url.startsWith('https://github.com/') ? rel.html_url : `https://github.com/${REPO}/releases`,
    published: rel.published_at || '',
    assets,
  };
}

/** Dernier contenu publié sur la branche « contenu » (null si le canal n'existe pas encore). */
async function checkContent(installedVersion, appVersion) {
  const res = await net.fetch(`${CONTENT_BASE}/contenu.json`, { headers: headers(appVersion, 'application/json'), cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Index du contenu indisponible (${res.status}).`);
  const idx = await res.json();
  if (idx?.format !== 'netwiki-content-index' || typeof idx.version !== 'string' || !/^[\w.-]+\.netwiki$/.test(String(idx.file || ''))) {
    throw new Error('Index du contenu invalide.');
  }
  return {
    installed: installedVersion,
    latest: idx.version,
    newer: !installedVersion || compareVersions(idx.version, installedVersion) > 0,
    label: String(idx.label || ''),
    created: String(idx.created || ''),
    files: Number(idx.files) || 0,
    size: Number(idx.size) || 0,
    url: `${CONTENT_BASE}/${idx.file}`,
  };
}

module.exports = { REPO, LIMITS, checkApp, checkContent, download, compareVersions };
