// Construit le renderer (JS + CSS) dans dist/ avec esbuild.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
//   node build.mjs          → build de développement (sourcemaps)
//   node build.mjs --prod   → build minifié
//   node build.mjs --watch  → reconstruction à chaque modification
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const { contentVersion } = createRequire(import.meta.url)('./scripts/content-version.js');

const prod = process.argv.includes('--prod');
const watch = process.argv.includes('--watch');

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist', { recursive: true });
// Mermaid est volumineux : il est copié tel quel et chargé à la demande.
fs.copyFileSync('node_modules/mermaid/dist/mermaid.min.js', 'dist/mermaid.min.js');
// Version datée du contenu livré : l'application ne l'applique que si elle est plus récente que le contenu installé.
fs.writeFileSync('dist/content-version.json', JSON.stringify({ version: contentVersion('.') }) + '\n');

const options = {
  entryPoints: { app: 'src/js/app.js', styles: 'src/css/main.css' },
  bundle: true,
  outdir: 'dist',
  format: 'iife',
  target: 'chrome130',
  minify: prod,
  sourcemap: !prod,
  legalComments: 'none',
  loader: { '.woff2': 'file', '.woff': 'file' },
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
