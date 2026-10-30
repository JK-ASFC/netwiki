// NetWiki — vérification des mises à jour en ligne (Releases GitHub de JK-ASFC), uniquement avec l'accord de l'utilisateur.
// Aucune donnée personnelle n'est envoyée : une simple requête HTTPS anonyme vers l'API publique de GitHub.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const { net } = require('electron');

const REPO = 'JK-ASFC/netwiki';
const API_LATEST = `https://api.github.com/repos/${REPO}/releases/latest`;
const ALLOWED_DOWNLOAD_HOSTS = new Set(['github.com', 'objects.githubusercontent.com', 'release-assets.githubusercontent.com']);
const MAX_PACK_BYTES = 200 * 1024 * 1024;

/** Compare deux versions « 1.40.2 » (préfixe v accepté). Retourne >0 si a > b. */
function compareVersions(a, b) {
  const pa = String(a).replace(/^v/i, '').split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  const pb = String(b).replace(/^v/i, '').split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}

async function fetchJson(url, version) {
  const res = await net.fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': `NetWiki/${version}`, 'X-GitHub-Api-Version': '2022-11-28' },
    cache: 'no-store',
  });
  if (res.status === 404) throw new Error(`Aucune version publiée pour le moment sur github.com/${REPO}.`);
  if (!res.ok) throw new Error(`GitHub a répondu ${res.status}.`);
  return res.json();
}

/** Interroge la dernière release et indique ce qui est disponible. */
async function checkLatest(currentVersion) {
  const rel = await fetchJson(API_LATEST, currentVersion);
  const latest = String(rel.tag_name || rel.name || '').replace(/^v/i, '');
  const assets = Array.isArray(rel.assets) ? rel.assets : [];
  const pack = assets.find((a) => /^netwiki-content-.*\.netwiki$/i.test(a.name || ''));
  return {
    current: currentVersion,
    latest,
    newer: !!latest && compareVersions(latest, currentVersion) > 0,
    notes: String(rel.body || '').slice(0, 4000),
    page: typeof rel.html_url === 'string' && rel.html_url.startsWith('https://github.com/') ? rel.html_url : `https://github.com/${REPO}/releases`,
    pack: pack ? { name: pack.name, url: pack.browser_download_url, size: pack.size } : null,
    published: rel.published_at || '',
  };
}

/** Télécharge le paquet de contenu de la release (taille et hôte contrôlés). La signature est vérifiée par l'appelant. */
async function downloadPack(url, currentVersion) {
  const u = new URL(url);
  if (u.protocol !== 'https:' || !ALLOWED_DOWNLOAD_HOSTS.has(u.hostname)) throw new Error('Adresse de téléchargement refusée.');
  const res = await net.fetch(url, { headers: { 'User-Agent': `NetWiki/${currentVersion}`, Accept: 'application/octet-stream' } });
  if (!res.ok) throw new Error(`Téléchargement impossible (${res.status}).`);
  const len = Number(res.headers.get('content-length') || 0);
  if (len > MAX_PACK_BYTES) throw new Error('Paquet trop volumineux.');
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_PACK_BYTES) throw new Error('Paquet trop volumineux.');
  return buf;
}

module.exports = { REPO, checkLatest, downloadPack, compareVersions };
