// Construit le renderer (JS + CSS) dans dist/ avec esbuild.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
//   node build.mjs          → build de développement (sourcemaps)
//   node build.mjs --prod   → build minifié
//   node build.mjs --watch  → reconstruction à chaque modification
import * as esbuild from 'esbuild';
import fs from 'node:fs';

const prod = process.argv.includes('--prod');
const watch = process.argv.includes('--watch');

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist', { recursive: true });
// Mermaid est volumineux : il est copié tel quel et chargé à la demande.
fs.copyFileSync('node_modules/mermaid/dist/mermaid.min.js', 'dist/mermaid.min.js');

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
