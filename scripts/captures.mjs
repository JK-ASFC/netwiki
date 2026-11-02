// Captures d'écran attendues dans les articles : <!-- CAPTURE: description | _assets/fichier.png -->
//   node scripts/captures.mjs             → docs/catalogue/CAPTURES.md (liste des captures à faire, par fiche)
//   node scripts/captures.mjs --appliquer → remplace chaque emplacement dont l'image existe par l'image légendée
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const content = path.join(root, 'content');
const RE = /<!--\s*CAPTURE:\s*(.+?)\s*\|\s*(_assets\/[\w.-]+\.(?:png|jpe?g|webp|gif|svg|avif))\s*-->/gi;
const appliquer = process.argv.includes('--appliquer');

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pending = [];
let applied = 0;

for (const file of walk(content).filter((f) => f.endsWith('.md'))) {
  const src = fs.readFileSync(file, 'utf8');
  let changed = false;
  const out = src.replace(RE, (m, desc, rel) => {
    const img = path.join(path.dirname(file), rel);
    if (appliquer && fs.existsSync(img)) {
      changed = true;
      applied++;
      return `![${desc}](${rel} "${desc.replace(/"/g, "'")}")`;
    }
    pending.push({ article: path.relative(content, file), desc, image: path.relative(content, img), present: fs.existsSync(img) });
    return m;
  });
  if (changed) fs.writeFileSync(file, out);
}

const byFolder = new Map();
for (const p of pending) {
  const k = path.dirname(p.article);
  if (!byFolder.has(k)) byFolder.set(k, []);
  byFolder.get(k).push(p);
}
let md = `# Captures d'écran à ajouter\n\n${pending.length} capture(s) attendue(s) dans ${byFolder.size} fiche(s). Déposez chaque image au chemin indiqué, puis lancez \`node scripts/captures.mjs --appliquer\`.\n\n`;
for (const [folder, list] of byFolder) {
  md += `## ${folder}\n\n| Image à créer | Écran | Article |\n| --- | --- | --- |\n`;
  for (const p of list) md += `| \`content/${p.image}\`${p.present ? ' ✅' : ''} | ${p.desc} | \`${path.basename(p.article)}\` |\n`;
  md += '\n';
}
fs.mkdirSync(path.join(root, 'docs', 'catalogue'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs', 'catalogue', 'CAPTURES.md'), md);
console.log(`${appliquer ? `${applied} capture(s) insérée(s) · ` : ''}${pending.length} capture(s) en attente → docs/catalogue/CAPTURES.md`);
