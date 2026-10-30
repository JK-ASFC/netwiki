// Génère la paire de clés Ed25519 de JK-ASFC servant à signer les paquets de contenu officiels.
//   node scripts/gen-signing-key.js [dossier]
// La clé PRIVÉE est écrite HORS du projet (par défaut ~/.netwiki-signing) et ne doit jamais être publiée :
// conservez-en une copie hors ligne et déclarez-la comme secret NETWIKI_SIGNING_KEY dans GitHub Actions.
// La clé PUBLIQUE est intégrée à main/pack.js pour que l'application vérifie les paquets.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const dir = process.argv[2] || path.join(os.homedir(), '.netwiki-signing');
const privPath = path.join(dir, 'netwiki-ed25519-private.pem');
const pubPath = path.join(dir, 'netwiki-ed25519-public.pem');
const packJs = path.join(__dirname, '..', 'main', 'pack.js');

if (fs.existsSync(privPath)) {
  console.error(`Une clé existe déjà : ${privPath} — rien n'a été modifié.`);
  process.exit(1);
}
fs.mkdirSync(dir, { recursive: true });
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
fs.writeFileSync(privPath, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
const pubPem = publicKey.export({ type: 'spki', format: 'pem' });
fs.writeFileSync(pubPath, pubPem);

const body = pubPem.split('\n').filter((l) => l && !l.startsWith('-----')).join('\n');
const src = fs.readFileSync(packJs, 'utf8');
if (!src.includes('__NETWIKI_PUBLIC_KEY__')) {
  console.error('main/pack.js contient déjà une clé publique : remplacez-la manuellement si nécessaire.');
} else {
  fs.writeFileSync(packJs, src.replace('__NETWIKI_PUBLIC_KEY__', body));
}
console.log('Clé privée :', privPath);
console.log('Clé publique :', pubPath);
console.log('Empreinte SHA-256 de la clé publique :', crypto.createHash('sha256').update(publicKey.export({ type: 'spki', format: 'der' })).digest('hex'));
