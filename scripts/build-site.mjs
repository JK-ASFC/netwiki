// Construit le site de présentation de NetWiki (GitHub Pages) dans _site/.
//   - copie site/ (HTML, CSS, JS, images), les polices du logiciel et son icône ;
//   - calcule les chiffres et la liste des catégories à partir de content/ (toujours à jour) ;
//   - extrait les tables de correspondance des commandes pour la démo interactive ;
//   - remplace les marqueurs {{…}} de index.html et les icônes <i data-icon="…"></i> (Lucide, comme le logiciel).
//   node scripts/build-site.mjs
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { icons } from 'lucide';

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, 'site');
const out = path.join(root, '_site');
const content = path.join(root, 'content');
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const { contentVersion } = require('./content-version.js');

// ---------------------------------------------------------------- icônes Lucide (même rendu que le logiciel)
const pascal = (n) => String(n).replace(/(^|[-_ ]+)([a-z0-9])/gi, (_, __, c) => c.toUpperCase());
function svg(name, size = 20, cls = 'i') {
  const node = icons[pascal(name)];
  if (!node) throw new Error(`Icône inconnue : ${name}`);
  const inner = node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------------------------------------------------------------- contenu du wiki
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const folderMeta = (dir) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, '_folder.json'), 'utf8'));
  } catch {
    return {};
  }
};
const body = (file) => fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?\n---\n/, '');

const pages = walk(content).filter((f) => f.endsWith('.md'));
const words = pages.reduce((n, f) => n + (body(f).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length, 0);
const cheatsheets = pages.filter((f) => path.basename(f) === '90-aide-memoire.md').length;
const categories = fs
  .readdirSync(content, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => {
    const dir = path.join(content, e.name);
    const meta = folderMeta(dir);
    const services = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== '_assets');
    return {
      id: e.name,
      title: meta.title || e.name,
      icon: meta.icon || 'folder',
      color: /^#[0-9a-f]{6}$/i.test(meta.color || '') ? meta.color : '#6366f1',
      description: meta.description || '',
      articles: walk(dir).filter((f) => f.endsWith('.md')).length,
      services: services.map((d) => folderMeta(path.join(dir, d.name)).title || d.name),
    };
  });
const vendors = categories.find((c) => c.id.includes('constructeurs'))?.services.filter((s) => !/correspondance/i.test(s)) || [];
const services = categories.reduce((n, c) => n + c.services.length, 0);

// ---------------------------------------------------------------- correspondance des commandes (démo)
function commandTables(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
  const tasks = new Map();
  for (let i = 0; i < lines.length - 1; i++) {
    if (!/^\|\s*Tâche\s*\|/.test(lines[i]) || !/^\|\s*-/.test(lines[i + 1])) continue;
    const head = cells(lines[i]).slice(1);
    for (let j = i + 2; j < lines.length && lines[j].startsWith('|'); j++) {
      const [task, ...cmds] = cells(lines[j]);
      if (!tasks.has(task)) tasks.set(task, {});
      head.forEach((v, k) => {
        if (cmds[k]) tasks.get(task)[v] = cmds[k];
      });
    }
  }
  return [...tasks].map(([task, cmds]) => ({ task, cmds })).filter((t) => Object.keys(t.cmds).length >= 4);
}
const corr = commandTables(path.join(content, '22-constructeurs', '01-correspondance-commandes', '01-administration-commutation.md'));

// ---------------------------------------------------------------- sortie
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
const fonts = [
  ['inter', 'inter-latin-wght-normal.woff2'],
  ['inter', 'inter-latin-ext-wght-normal.woff2'],
  ['jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2'],
];
for (const [pkg, file] of fonts) fs.copyFileSync(path.join(root, 'node_modules', '@fontsource-variable', pkg, 'files', file), path.join(out, 'fonts', file));
fs.copyFileSync(path.join(root, 'build', 'icon.png'), path.join(out, 'img', 'icon.png'));
fs.writeFileSync(path.join(out, '.nojekyll'), '');

const fmt = (n) => n.toLocaleString('fr-FR').replace(/ /g, ' ');
const categoriesHtml = categories
  .map(
    (c) => `<li class="cat reveal" style="--c:${c.color}" title="${esc(c.description)}">
      <span class="cat-ic">${svg(c.icon, 20)}</span>
      <span class="cat-txt"><b>${esc(c.title)}</b><small>${c.articles} articles · ${esc(c.services.slice(0, 4).join(', '))}${c.services.length > 4 ? '…' : ''}</small></span>
    </li>`
  )
  .join('\n');
const vendorsHtml = vendors.map((v) => `<li>${esc(v)}</li>`).join('');

const values = {
  version,
  contentDate: (() => {
    const [y, m, d] = contentVersion(root).split('.');
    return new Date(Date.UTC(+y, +m - 1, +d)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  })(),
  articles: fmt(pages.length),
  categories: fmt(categories.length),
  services: fmt(services),
  cheatsheets: fmt(cheatsheets),
  vendors: fmt(vendors.length),
  words: fmt(Math.round(words / 1000) * 1000),
  categoriesHtml,
  vendorsHtml,
};
let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in values ? values[k] : m));
html = html.replace(/<i\b([^>]*?)\sdata-icon="([\w-]+)"([^>]*)><\/i>/g, (_, before, n, after) => {
  const attrs = before + after;
  const size = Number(/data-size="(\d+)"/.exec(attrs)?.[1]) || 20;
  const cls = /class="([^"]+)"/.exec(attrs)?.[1];
  return svg(n, size, cls ? `i ${cls}` : 'i');
});
const left = html.match(/\{\{\w+\}\}|data-icon=/g);
if (left) throw new Error(`Marqueurs non remplacés : ${left.join(', ')}`);
fs.writeFileSync(path.join(out, 'index.html'), html);

const copyIcon = svg('copy', 15);
const checkIcon = svg('check', 15);
fs.writeFileSync(path.join(out, 'data.json'), JSON.stringify({ version, corr, icons: { copy: copyIcon, check: checkIcon } }));
console.log(`Site construit dans _site/ : ${pages.length} articles, ${categories.length} catégories, ${cheatsheets} aide-mémoires, ${vendors.length} constructeurs, ${corr.length} tâches de correspondance.`);
