// NetWiki — contenu officiel dans le dossier des données : import du contenu livré avec l'application
// et suivi de la version installée (contenu livré ou paquet hebdomadaire signé).
// Copyright (c) 2026 JK-ASFC — licence MIT.
//
// Chaque contenu officiel porte une version datée (AAAA.MM.JJ.HHMM). Le contenu livré avec l'application
// n'est appliqué que s'il est plus récent que le contenu déjà installé : un ancien exécutable ne remet
// donc jamais en place des articles plus anciens que ceux reçus par une mise à jour.

const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const crypto = require('node:crypto');

const SEED_MANIFEST = '.netwiki-seed.json';
const CONTENT_STATE = '.netwiki-content.json';

/** Compare deux versions « 1.40.2 » ou « 2026.11.02.0500 » (préfixe v accepté). Retourne >0 si a > b. */
function compareVersions(a, b) {
  const pa = String(a).replace(/^v/i, '').split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  const pb = String(b).replace(/^v/i, '').split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

async function exists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
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

async function readManifest(dataRoot) {
  try {
    return JSON.parse(await fsp.readFile(path.join(dataRoot, SEED_MANIFEST), 'utf8'));
  } catch {
    return {};
  }
}

async function writeManifest(dataRoot, manifest) {
  await fsp.writeFile(path.join(dataRoot, SEED_MANIFEST), JSON.stringify(manifest, null, 2), 'utf8');
}

/** Version du contenu officiel installé : { version, source, label, updated } (version vide si inconnue). */
async function readContentState(dataRoot) {
  try {
    const s = JSON.parse(await fsp.readFile(path.join(dataRoot, CONTENT_STATE), 'utf8'));
    return { version: String(s.version || ''), source: String(s.source || ''), label: String(s.label || ''), updated: String(s.updated || '') };
  } catch {
    return { version: '', source: '', label: '', updated: '' };
  }
}

/** Enregistre la version du contenu installé, seulement si elle est plus récente que la précédente. */
async function recordContentVersion(dataRoot, { version, source, label = '' }) {
  if (!version) return false;
  const current = await readContentState(dataRoot);
  if (current.version && compareVersions(version, current.version) <= 0) return false;
  const state = { version, source, label, updated: new Date().toISOString() };
  await fsp.writeFile(path.join(dataRoot, CONTENT_STATE), JSON.stringify(state, null, 2), 'utf8');
  return true;
}

/**
 * Importe le contenu livré avec l'application dans le dossier des données.
 * Un manifeste mémorise l'empreinte de la dernière version officielle de chaque fichier :
 *  - un fichier jamais importé est copié s'il n'existe pas ;
 *  - un fichier mis à jour dans un contenu plus récent est remplacé seulement si l'utilisateur ne l'a pas modifié ;
 *  - un fichier supprimé ou déplacé par l'utilisateur n'est jamais recréé (sauf restauration demandée : `force`).
 * `bundledVersion` : version du contenu livré ; vide = toujours appliqué (version de développement).
 */
async function syncSeeds({ seedDir, dataRoot, bundledVersion = '', force = false }) {
  if (!(await exists(seedDir))) return 0;
  await fsp.mkdir(dataRoot, { recursive: true });
  const state = await readContentState(dataRoot);
  // Contenu livré plus ancien (ou identique) que le contenu installé : rien à faire.
  if (!force && bundledVersion && state.version && compareVersions(bundledVersion, state.version) <= 0) return 0;

  const manifest = await readManifest(dataRoot);
  let imported = 0;
  for (const rel of await walkFiles(seedDir)) {
    const seed = await fsp.readFile(path.join(seedDir, rel));
    const seedHash = sha1(seed);
    const target = path.join(dataRoot, rel);
    const known = manifest[rel];
    const targetExists = await exists(target);

    if (!known || force) {
      if (!targetExists) {
        await fsp.mkdir(path.dirname(target), { recursive: true });
        await fsp.writeFile(target, seed);
        imported++;
        manifest[rel] = seedHash;
      } else if (!known) {
        manifest[rel] = seedHash;
      }
      continue;
    }
    if (known !== seedHash && targetExists && sha1(await fsp.readFile(target)) === known) {
      await fsp.writeFile(target, seed);
      imported++;
    }
    manifest[rel] = seedHash;
  }
  await writeManifest(dataRoot, manifest);
  if (bundledVersion) await recordContentVersion(dataRoot, { version: bundledVersion, source: 'application' });
  return imported;
}

module.exports = { SEED_MANIFEST, CONTENT_STATE, compareVersions, readManifest, writeManifest, readContentState, recordContentVersion, syncSeeds };
