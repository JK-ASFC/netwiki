// Construit le paquet de contenu officiel signé (mise à jour en ligne ou distribution hors ligne).
//   node scripts/pack-content.js                → release/netwiki-content-<version>.netwiki (joint aux Releases)
//   node scripts/pack-content.js --canal <dir>  → <dir>/netwiki-contenu.netwiki + <dir>/contenu.json (publication hebdomadaire)
// Clé privée : variable NETWIKI_SIGNING_KEY (chemin du fichier PEM ou contenu PEM), sinon ~/.netwiki-signing.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { buildPack, readPack } = require('../main/pack.js');
const { contentVersion } = require('./content-version.js');

(async () => {
  const root = path.join(__dirname, '..');
  const args = process.argv.slice(2);
  const canal = args.includes('--canal') ? path.resolve(args[args.indexOf('--canal') + 1] || 'canal') : null;
  const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const env = process.env.NETWIKI_SIGNING_KEY || '';
  const keyFile = path.join(os.homedir(), '.netwiki-signing', 'netwiki-ed25519-private.pem');
  const pem = env.includes('BEGIN PRIVATE KEY') ? env : fs.readFileSync(env || keyFile, 'utf8');

  const cv = contentVersion(root);
  const [y, m, d] = cv.split('.');
  const label = `Contenu NetWiki du ${d}/${m}/${y}`;
  const { buffer, count, contentHash } = await buildPack(path.join(root, 'content'), { appVersion: version, contentVersion: cv, label, privateKeyPem: pem });
  const check = readPack(buffer, { requireSignature: true });

  let out;
  if (canal) {
    fs.mkdirSync(canal, { recursive: true });
    out = path.join(canal, 'netwiki-contenu.netwiki');
    fs.writeFileSync(out, buffer);
    const index = {
      format: 'netwiki-content-index',
      version: cv,
      label,
      created: new Date().toISOString(),
      file: 'netwiki-contenu.netwiki',
      files: count,
      size: buffer.length,
      sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
      contentHash,
      appVersion: version,
    };
    fs.writeFileSync(path.join(canal, 'contenu.json'), JSON.stringify(index, null, 2) + '\n');
  } else {
    out = path.join(root, 'release', `netwiki-content-${version}.netwiki`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, buffer);
  }
  console.log(`${out} — contenu ${cv}, ${count} fichiers, ${(buffer.length / 1048576).toFixed(1)} Mo, signature vérifiée (${check.signed}).`);
})().catch((err) => {
  console.error('Échec :', err.message);
  process.exit(1);
});
