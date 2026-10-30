// Construit la version web / mobile de NetWiki dans mobile/www (Capacitor : Android et iOS).
//   node scripts/build-web.mjs [--prod]
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const prod = process.argv.includes('--prod');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const www = path.join(root, 'mobile', 'www');
const dist = path.join(www, 'dist');
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

await esbuild.build({
  absWorkingDir: root,
  entryPoints: { app: 'src/js/app.js', styles: 'src/css/main.css', platform: 'src/platform/web.js' },
  bundle: true,
  outdir: dist,
  format: 'iife',
  target: ['chrome110', 'safari16'],
  minify: prod,
  sourcemap: !prod,
  legalComments: 'none',
  loader: { '.woff2': 'file', '.woff': 'file' },
  logLevel: 'info',
});
const platformJs = path.join(dist, 'platform.js');
fs.writeFileSync(platformJs, fs.readFileSync(platformJs, 'utf8').replace('__NETWIKI_VERSION__', version));
fs.copyFileSync(path.join(root, 'node_modules/mermaid/dist/mermaid.min.js'), path.join(dist, 'mermaid.min.js'));

// Page d'entrée : mêmes éléments que la version de bureau, CSP adaptée (pas de wikifile:, API GitHub autorisée).
let html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
html = html
  .replace(/content="default-src[^"]*"/, `content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'"`)
  .replace('width=device-width, initial-scale=1', 'width=device-width, initial-scale=1, viewport-fit=cover')
  .replaceAll('../dist/', './dist/')
  .replace('<script defer src="./dist/app.js"></script>', '<script defer src="./dist/platform.js"></script>\n    <script defer src="./dist/app.js"></script>');
fs.writeFileSync(path.join(www, 'index.html'), html);

// Contenu livré : articles Markdown et métadonnées de dossiers.
const files = {};
const walk = (dir, rel = '') => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(path.join(dir, e.name), r);
    else if (e.name.endsWith('.md') || e.name === '_folder.json') files[r] = fs.readFileSync(path.join(dir, e.name), 'utf8');
  }
};
walk(path.join(root, 'content'));
fs.writeFileSync(path.join(www, 'content.json'), JSON.stringify({ version, built: Date.now(), files }));
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(www, 'LICENSE.txt'));
fs.copyFileSync(path.join(root, 'build', 'icon.png'), path.join(www, 'icon.png'));
console.log(`mobile/www prêt : ${Object.keys(files).length} fichiers de contenu, version ${version}.`);
