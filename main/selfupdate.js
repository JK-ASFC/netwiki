// NetWiki — mise à jour du logiciel lui-même sous Windows.
//  - version portable : le fichier .exe lancé est remplacé sur place par la nouvelle version, puis NetWiki redémarre ;
//  - version installée : le nouvel installeur est téléchargé puis lancé (il ferme NetWiki et met à jour l'installation).
// Le fichier téléchargé doit figurer, avec son empreinte SHA-256, dans la liste « netwiki-update.json » signée par JK-ASFC.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const { app } = require('electron');
const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const pack = require('./pack.js');
const updates = require('./updates.js');

const MANIFEST_ASSET = 'netwiki-update.json';
const PORTABLE_ASSET = 'NetWiki-portable.exe';
const SETUP_ASSET = /^NetWiki-Setup-[\d.]+\.exe$/;

/** « portable », « installer » ou null (macOS, Linux, version de développement : page de téléchargement). */
function mode() {
  if (process.platform !== 'win32') return null;
  if (process.env.PORTABLE_EXECUTABLE_FILE) return 'portable';
  if (app.isPackaged && fs.existsSync(path.join(path.dirname(process.execPath), 'Uninstall NetWiki.exe'))) return 'installer';
  return null;
}

/** Télécharge le fichier adapté à cette installation et vérifie son empreinte dans la liste signée. */
async function fetchVerified(release, currentVersion, onProgress) {
  const m = mode();
  if (!m) throw new Error('Mise à jour automatique indisponible pour cette installation : utilisez la page de téléchargement.');
  const list = release.assets.find((a) => a.name === MANIFEST_ASSET);
  const asset = m === 'portable' ? release.assets.find((a) => a.name === PORTABLE_ASSET) : release.assets.find((a) => SETUP_ASSET.test(a.name));
  if (!list || !asset) throw new Error('Cette version ne propose pas de mise à jour automatique : utilisez la page de téléchargement.');
  const doc = pack.readSignedDocument(await updates.download(list.url, currentVersion, { maxBytes: updates.LIMITS.json }));
  if (doc?.format !== 'netwiki-update' || String(doc.version) !== release.latest) throw new Error('Liste signée incohérente avec la version annoncée.');
  const expected = doc.files?.[asset.name];
  if (!expected || !/^[0-9a-f]{64}$/.test(String(expected.sha256))) throw new Error(`${asset.name} ne figure pas dans la liste signée.`);
  const buf = await updates.download(asset.url, currentVersion, { maxBytes: updates.LIMITS.app, onProgress });
  if (crypto.createHash('sha256').update(buf).digest('hex') !== expected.sha256) {
    throw new Error('Empreinte du fichier téléchargé incorrecte : mise à jour annulée.');
  }
  return { mode: m, buf, name: asset.name };
}

/** Remplace l'exécutable portable : sous Windows, un .exe en cours d'utilisation peut être renommé (mais pas effacé). */
async function replacePortable(buf) {
  const target = process.env.PORTABLE_EXECUTABLE_FILE;
  const tmp = `${target}.download`;
  const old = `${target}.${Date.now()}.old`;
  try {
    await fsp.writeFile(tmp, buf);
  } catch (err) {
    throw new Error(`Écriture impossible dans ${path.dirname(target)} (${err.code || err.message}) : téléchargez la nouvelle version depuis la page officielle.`);
  }
  try {
    await fsp.rename(target, old);
  } catch (err) {
    await fsp.rm(tmp, { force: true });
    throw new Error(`Remplacement de ${path.basename(target)} impossible (${err.code || err.message}).`);
  }
  try {
    await fsp.rename(tmp, target);
  } catch (err) {
    await fsp.rename(old, target).catch(() => {});
    await fsp.rm(tmp, { force: true });
    throw new Error(`Remplacement de ${path.basename(target)} impossible (${err.code || err.message}).`);
  }
  return { relaunch: target, cleanup: old };
}

async function launchInstaller(buf, name) {
  const file = path.join(os.tmpdir(), name);
  await fsp.writeFile(file, buf);
  spawn(file, ['--updated'], { detached: true, stdio: 'ignore' }).unref();
  return { relaunch: null, cleanup: file };
}

/** Télécharge, vérifie et installe la nouvelle version. Retourne { mode, relaunch, cleanup }. */
async function install(release, currentVersion, onProgress) {
  const { mode: m, buf, name } = await fetchVerified(release, currentVersion, onProgress);
  const r = m === 'portable' ? await replacePortable(buf) : await launchInstaller(buf, name);
  return { mode: m, ...r };
}

/** Au démarrage : supprime l'ancien exécutable portable et l'installeur téléchargé (fichiers encore verrouillés : plus tard). */
async function cleanup(files) {
  const keep = [];
  for (const f of Array.isArray(files) ? files : []) {
    const name = path.basename(String(f));
    const ours = /\.\d+\.old$/.test(name) || (SETUP_ASSET.test(name) && path.dirname(String(f)) === os.tmpdir());
    if (!ours) continue;
    try {
      await fsp.rm(f, { force: true });
    } catch {
      keep.push(f);
    }
  }
  return keep;
}

module.exports = { mode, install, cleanup, MANIFEST_ASSET, PORTABLE_ASSET };
