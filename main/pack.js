// NetWiki — paquets de contenu (.netwiki) : export, vérification de signature et import sûr.
// Copyright (c) 2026 JK-ASFC — licence MIT.
//
// Format d'un paquet : JSON {
//   format: "netwiki-pack", version: 1, signer: "JK-ASFC" | null,
//   payload: base64(gzip(JSON { appVersion, contentVersion, created, label, files: { "chemin/relatif.md": base64 } })),
//   signature: base64(Ed25519(payload décodé)) | null
// }
// Les paquets officiels (mises à jour en ligne) sont signés avec la clé privée de JK-ASFC ;
// l'application ne connaît que la clé publique ci-dessous et refuse tout paquet en ligne non signé ou altéré.

const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');

const PACK_FORMAT = 'netwiki-pack';
const PACK_VERSION = 1;
const SIGNER = 'JK-ASFC';

// Clé publique Ed25519 de JK-ASFC (vérification des paquets officiels).
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAT4XlvzK8xlul2N+ue973/eYUyR0QR6vqomGZnU/iPLk=
-----END PUBLIC KEY-----`;

const LIMITS = { files: 20000, fileBytes: 20 * 1024 * 1024, totalBytes: 400 * 1024 * 1024, packBytes: 200 * 1024 * 1024 };
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

/** Un chemin de paquet n'est accepté que s'il reste dans le dossier des données et vise un type de fichier autorisé. */
function isAllowedPath(rel) {
  if (typeof rel !== 'string' || !rel || rel.length > 400) return false;
  if (rel.includes('\\') || rel.includes('\0') || rel.startsWith('/') || /^[a-zA-Z]:/.test(rel)) return false;
  const parts = rel.split('/');
  if (parts.some((p) => !p || p === '.' || p === '..' || p.startsWith('.'))) return false;
  const name = parts[parts.length - 1];
  const ext = path.extname(name).toLowerCase();
  if (ext === '.md') return true;
  if (name === '_folder.json') return true;
  return IMAGE_EXT.has(ext) && parts.includes('_assets');
}

function publicKey() {
  if (PUBLIC_KEY_PEM.includes('__NETWIKI_PUBLIC_KEY__')) return null;
  return crypto.createPublicKey(PUBLIC_KEY_PEM);
}

/** Lit et vérifie un paquet. Retourne { inner, signed } ou lève une erreur explicite. */
function readPack(buf, { requireSignature = false } = {}) {
  if (buf.length > LIMITS.packBytes) throw new Error('Paquet trop volumineux.');
  let outer;
  try {
    outer = JSON.parse(buf.toString('utf8'));
  } catch {
    throw new Error("Ce fichier n'est pas un paquet NetWiki.");
  }
  if (outer?.format !== PACK_FORMAT || outer.version !== PACK_VERSION || typeof outer.payload !== 'string') {
    throw new Error("Format de paquet NetWiki inconnu ou d'une version plus récente.");
  }
  const payload = Buffer.from(outer.payload, 'base64');
  let signed = false;
  if (outer.signature) {
    const key = publicKey();
    if (!key) throw new Error('Aucune clé de vérification n’est intégrée à cette version de NetWiki.');
    const ok = crypto.verify(null, payload, key, Buffer.from(outer.signature, 'base64'));
    if (!ok) throw new Error('Signature invalide : le paquet a été modifié ou ne provient pas de JK-ASFC.');
    signed = true;
  } else if (requireSignature) {
    throw new Error('Paquet non signé : les mises à jour en ligne doivent être signées par JK-ASFC.');
  }
  let inner;
  try {
    inner = JSON.parse(zlib.gunzipSync(payload, { maxOutputLength: LIMITS.totalBytes * 2 }).toString('utf8'));
  } catch {
    throw new Error('Contenu du paquet illisible ou corrompu.');
  }
  const entries = Object.entries(inner?.files || {});
  if (!entries.length) throw new Error('Le paquet ne contient aucun fichier.');
  if (entries.length > LIMITS.files) throw new Error('Le paquet contient trop de fichiers.');
  let total = 0;
  const files = new Map();
  for (const [rel, b64] of entries) {
    if (!isAllowedPath(rel)) throw new Error(`Chemin refusé dans le paquet : ${rel}`);
    const data = Buffer.from(String(b64), 'base64');
    if (data.length > LIMITS.fileBytes) throw new Error(`Fichier trop volumineux dans le paquet : ${rel}`);
    total += data.length;
    if (total > LIMITS.totalBytes) throw new Error('Contenu du paquet trop volumineux.');
    files.set(rel, data);
  }
  return {
    signed,
    meta: {
      appVersion: String(inner.appVersion || ''),
      contentVersion: String(inner.contentVersion || inner.appVersion || ''),
      created: String(inner.created || ''),
      label: String(inner.label || ''),
    },
    files,
  };
}

/** Construit un paquet à partir d'un dossier (contenu des données ou dossier « content » du projet). */
async function buildPack(rootDir, { appVersion, label = '', privateKeyPem = null } = {}) {
  const files = {};
  const walk = async (dir, rel = '') => {
    for (const e of await fsp.readdir(dir, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (!e.name.startsWith('.')) await walk(path.join(dir, e.name), r);
      } else if (isAllowedPath(r)) {
        files[r] = (await fsp.readFile(path.join(dir, e.name))).toString('base64');
      }
    }
  };
  await walk(rootDir);
  const inner = { appVersion, contentVersion: appVersion, created: new Date().toISOString(), label, files };
  const payload = zlib.gzipSync(Buffer.from(JSON.stringify(inner), 'utf8'), { level: 9 });
  const signature = privateKeyPem ? crypto.sign(null, payload, crypto.createPrivateKey(privateKeyPem)).toString('base64') : null;
  const outer = { format: PACK_FORMAT, version: PACK_VERSION, signer: privateKeyPem ? SIGNER : null, payload: payload.toString('base64'), signature };
  return { buffer: Buffer.from(JSON.stringify(outer), 'utf8'), count: Object.keys(files).length };
}

/**
 * Prépare l'import (sans rien écrire) en appliquant les mêmes règles que le contenu d'origine :
 * nouveau fichier → ajouté ; fichier jamais modifié par l'utilisateur → mis à jour ;
 * fichier modifié localement → conservé (signalé) ; fichier supprimé par l'utilisateur → non recréé.
 */
async function planImport(files, dataRoot, manifest) {
  const plan = { add: [], update: [], same: [], keep: [], skipDeleted: [] };
  for (const [rel, data] of files) {
    const target = path.join(dataRoot, ...rel.split('/'));
    const newHash = sha1(data);
    const known = manifest[rel];
    let current = null;
    try {
      current = sha1(await fsp.readFile(target));
    } catch {}
    if (current === null) (known ? plan.skipDeleted : plan.add).push(rel);
    else if (current === newHash) plan.same.push(rel);
    else if (known && current === known) plan.update.push(rel);
    else plan.keep.push(rel);
  }
  return plan;
}

async function applyImport(files, plan, dataRoot, manifest) {
  const root = path.resolve(dataRoot);
  for (const rel of [...plan.add, ...plan.update]) {
    const target = path.resolve(root, ...rel.split('/'));
    if (!target.startsWith(root + path.sep)) throw new Error(`Chemin refusé : ${rel}`);
    await fsp.mkdir(path.dirname(target), { recursive: true });
    await fsp.writeFile(target, files.get(rel));
  }
  for (const [rel, data] of files) manifest[rel] = sha1(data);
  return { added: plan.add.length, updated: plan.update.length, kept: plan.keep.length };
}

module.exports = { buildPack, readPack, planImport, applyImport, isAllowedPath, SIGNER };
