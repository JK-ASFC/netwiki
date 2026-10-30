// Liste signée des fichiers d'une version (empreintes SHA-256) : NetWiki la vérifie avant toute mise à jour du logiciel.
//   node scripts/sign-release.js <dossier> <version>  → <dossier>/netwiki-update.json
// Clé privée : variable NETWIKI_SIGNING_KEY (chemin du fichier PEM ou contenu PEM), sinon ~/.netwiki-signing.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { signDocument, readSignedDocument } = require('../main/pack.js');

const OUT_NAME = 'netwiki-update.json';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

const [dir, rawVersion] = process.argv.slice(2);
if (!dir || !rawVersion) {
  console.error('Usage : node scripts/sign-release.js <dossier> <version>');
  process.exit(1);
}
const env = process.env.NETWIKI_SIGNING_KEY || '';
const keyFile = path.join(os.homedir(), '.netwiki-signing', 'netwiki-ed25519-private.pem');
const pem = env.includes('BEGIN PRIVATE KEY') ? env : fs.readFileSync(env || keyFile, 'utf8');

const files = {};
for (const file of walk(path.resolve(dir))) {
  const name = path.basename(file);
  if (name === OUT_NAME) continue;
  if (files[name]) throw new Error(`Nom de fichier en double : ${name}`);
  const buf = fs.readFileSync(file);
  files[name] = { sha256: crypto.createHash('sha256').update(buf).digest('hex'), size: buf.length };
}
const doc = { format: 'netwiki-update', version: rawVersion.replace(/^v/i, ''), created: new Date().toISOString(), files };
const signed = signDocument(doc, pem);
readSignedDocument(signed);
fs.writeFileSync(path.join(path.resolve(dir), OUT_NAME), signed);
console.log(`${OUT_NAME} : ${Object.keys(files).length} fichiers signés pour la version ${doc.version}.`);
