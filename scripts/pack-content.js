// Construit le paquet de contenu officiel signé (mise à jour en ligne ou distribution hors ligne).
//   node scripts/pack-content.js            → release/netwiki-content-<version>.netwiki
// Clé privée : variable NETWIKI_SIGNING_KEY (chemin du fichier PEM ou contenu PEM), sinon ~/.netwiki-signing.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { buildPack, readPack } = require('../main/pack.js');

(async () => {
  const root = path.join(__dirname, '..');
  const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const env = process.env.NETWIKI_SIGNING_KEY || '';
  const keyFile = path.join(os.homedir(), '.netwiki-signing', 'netwiki-ed25519-private.pem');
  const pem = env.includes('BEGIN PRIVATE KEY') ? env : fs.readFileSync(env || keyFile, 'utf8');
  const { buffer, count } = await buildPack(path.join(root, 'content'), { appVersion: version, label: `Contenu NetWiki ${version}`, privateKeyPem: pem });
  const check = readPack(buffer, { requireSignature: true });
  const out = path.join(root, 'release', `netwiki-content-${version}.netwiki`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buffer);
  console.log(`${out} — ${count} fichiers, ${(buffer.length / 1048576).toFixed(1)} Mo, signature vérifiée (${check.signed}).`);
})().catch((err) => {
  console.error('Échec :', err.message);
  process.exit(1);
});
