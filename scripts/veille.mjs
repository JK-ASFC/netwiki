// Veille des versions des services documentés : GitHub (releases ou tags) et endoflife.date.
//   node scripts/veille.mjs   (GITHUB_TOKEN recommandé : 5 000 requêtes/h au lieu de 60)
// Entrée  : docs/catalogue/suivi.json (champs depot = « propriétaire/dépôt », eol = produit endoflife.date)
// État    : $VEILLE_ETAT (par défaut .veille/etat.json) — dernière version vue de chaque service
// Sorties : .veille/rapport.md (rapport lisible), .veille/nouveautes.json (pour l'agent IA), état mis à jour
// Le premier passage enregistre les versions de référence sans rien signaler.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, '.veille');
const ETAT = process.env.VEILLE_ETAT || path.join(outDir, 'etat.json');
const TOKEN = process.env.GITHUB_TOKEN || '';
const JOURS_FIN_DE_VIE = 120;

const suivi = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalogue', 'suivi.json'), 'utf8'));
const etat = fs.existsSync(ETAT) ? JSON.parse(fs.readFileSync(ETAT, 'utf8')) : {};
const premier = Object.keys(etat).length === 0;

// Une source par fiche : plusieurs lignes du catalogue peuvent pointer vers la même fiche et le même dépôt.
const vus = new Set();
const MAX = Number(process.env.VEILLE_MAX) || Infinity; // tests : limiter le nombre de sources
const sources = suivi.services.filter((s) => {
  if (s.statut === 'a-faire' || (!s.depot && !s.eol)) return false;
  const k = `${s.depot || ''}|${s.eol || ''}`;
  if (vus.has(k)) return false;
  vus.add(k);
  return true;
}).slice(0, MAX);

const gh = (url) =>
  fetch(`https://api.github.com${url}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'NetWiki-veille', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  });

/** Compare deux versions « v1.2.10 », « release_3_2_7 », « V_9_9_P1 » (> 0 si a > b). */
function cmp(a, b) {
  const pa = String(a).match(/\d+/g)?.map(Number) || [];
  const pb = String(b).match(/\d+/g)?.map(Number) || [];
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
}
const PRE = /(alpha|beta|rc|pre|preview|nightly|dev|snapshot|canary|insider|test)/i;

async function depuisGitHub(depot) {
  const r = await gh(`/repos/${depot}/releases/latest`);
  if (r.ok) {
    const j = await r.json();
    return { version: j.tag_name, date: j.published_at?.slice(0, 10) || '', url: j.html_url, notes: String(j.body || '').slice(0, 6000) };
  }
  if (r.status !== 404) throw new Error(`GitHub ${r.status} (${depot})`);
  // Pas de « release » : plus haute étiquette stable parmi les 100 dernières
  const t = await gh(`/repos/${depot}/tags?per_page=100`);
  if (!t.ok) throw new Error(`GitHub ${t.status} (${depot}, étiquettes)`);
  const tags = (await t.json()).map((x) => x.name).filter((n) => /\d/.test(n) && !PRE.test(n));
  if (!tags.length) throw new Error(`aucune version publiée (${depot})`);
  const best = tags.sort(cmp).at(-1);
  return { version: best, date: '', url: `https://github.com/${depot}/releases/tag/${encodeURIComponent(best)}`, notes: '' };
}

async function depuisEol(produit) {
  const r = await fetch(`https://endoflife.date/api/${produit}.json`, { headers: { 'User-Agent': 'NetWiki-veille' } });
  if (!r.ok) throw new Error(`endoflife.date ${r.status} (${produit})`);
  const cycles = await r.json();
  const c = cycles[0];
  const finProche = cycles
    .filter((x) => typeof x.eol === 'string' && x.eol >= new Date().toISOString().slice(0, 10))
    .filter((x) => (new Date(x.eol) - Date.now()) / 864e5 <= JOURS_FIN_DE_VIE)
    .map((x) => ({ cycle: String(x.cycle), eol: x.eol }));
  return { version: String(c.latest || c.cycle), date: c.latestReleaseDate || c.releaseDate || '', url: `https://endoflife.date/${produit}`, notes: '', finProche };
}

function drapeaux(notes) {
  const f = [];
  if (/\bCVE-\d{4}-\d+|security|sécurité|vulnerab/i.test(notes)) f.push('sécurité');
  if (/breaking|deprecat|removed|incompatib|no longer|obsolète/i.test(notes)) f.push('changements');
  return f;
}

async function verifier(s) {
  const res = { id: s.id, nom: s.nom, wiki: s.wiki };
  try {
    const g = s.depot ? await depuisGitHub(s.depot) : null;
    const e = s.eol ? await depuisEol(s.eol).catch((err) => (g ? { erreurEol: err.message } : Promise.reject(err))) : null;
    const v = g || e;
    Object.assign(res, { version: v.version, date: v.date || e?.date || '', url: v.url, notes: v.notes || '', finProche: e?.finProche || [] });
    if (e?.erreurEol) res.avertissement = e.erreurEol;
  } catch (err) {
    res.erreur = err.message;
  }
  return res;
}

// Requêtes par petits groupes (API GitHub et endoflife.date)
const resultats = [];
for (let i = 0; i < sources.length; i += 8) resultats.push(...(await Promise.all(sources.slice(i, i + 8).map(verifier))));

const nouveautes = [];
const finsDeVie = [];
const erreurs = [];
for (const r of resultats) {
  if (r.erreur) {
    erreurs.push(r);
    continue;
  }
  const avant = etat[r.id]?.version;
  if (avant && avant !== r.version && cmp(r.version, avant) > 0) nouveautes.push({ ...r, ancienne: avant, drapeaux: drapeaux(r.notes) });
  for (const f of r.finProche) finsDeVie.push({ nom: r.nom, wiki: r.wiki, ...f });
  etat[r.id] = { version: r.version, date: r.date, vu: new Date().toISOString().slice(0, 10) };
}

fs.mkdirSync(path.dirname(ETAT), { recursive: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(ETAT, JSON.stringify(etat, null, 1) + '\n');
fs.writeFileSync(path.join(outDir, 'nouveautes.json'), JSON.stringify(nouveautes.map(({ finProche, ...n }) => n), null, 1) + '\n');

// ---------------------------------------------------------------- rapport
const jour = new Date().toISOString().slice(0, 10);
const securite = nouveautes.filter((n) => n.drapeaux.includes('sécurité'));
const ruptures = nouveautes.filter((n) => n.drapeaux.includes('changements'));
let md = `## Rapport de veille du ${jour}\n\n`;
md += `| Sources suivies | Nouvelles versions | Correctifs de sécurité | Changements à vérifier | Fins de vie < ${JOURS_FIN_DE_VIE} j | Erreurs |\n| --- | --- | --- | --- | --- | --- |\n`;
md += `| ${resultats.length} | ${nouveautes.length} | ${securite.length} | ${ruptures.length} | ${finsDeVie.length} | ${erreurs.length} |\n\n`;
if (premier) md += `> Premier passage : ${resultats.length - erreurs.length} versions enregistrées comme référence. Les prochains rapports signaleront les nouveautés.\n\n`;
if (nouveautes.length) {
  md += `### Nouvelles versions\n\n| Service | Avant | Maintenant | Date | Alertes | Fiche |\n| --- | --- | --- | --- | --- | --- |\n`;
  for (const n of nouveautes)
    md += `| [${n.nom}](${n.url}) | ${n.ancienne} | **${n.version}** | ${n.date} | ${n.drapeaux.map((d) => (d === 'sécurité' ? '🔒 sécurité' : '⚠️ changements')).join(' ') || '—'} | \`${n.wiki}\` |\n`;
  md += '\n';
}
if (finsDeVie.length) {
  md += `### Fins de support proches\n\n| Service | Version | Fin de support | Fiche |\n| --- | --- | --- | --- |\n`;
  for (const f of finsDeVie) md += `| ${f.nom} | ${f.cycle} | ${f.eol} | \`${f.wiki}\` |\n`;
  md += '\n';
}
if (erreurs.length) {
  md += `<details><summary>Sources en erreur (${erreurs.length})</summary>\n\n`;
  for (const e of erreurs) md += `- ${e.nom} : ${e.erreur}\n`;
  md += `\n</details>\n\n`;
}
md += nouveautes.length
  ? `L'agent IA prépare une demande de fusion avec les mises à jour des fiches concernées (si la clé de l'agent est configurée). Rien n'est publié sans validation de JK-ASFC.\n`
  : `Aucune nouvelle version depuis le dernier passage.\n`;
fs.writeFileSync(path.join(outDir, 'rapport.md'), md);

console.log(`Veille : ${resultats.length} sources · ${nouveautes.length} nouvelle(s) version(s) · ${finsDeVie.length} fin(s) de support proche(s) · ${erreurs.length} erreur(s)`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `nouveautes=${nouveautes.length}\npremier=${premier}\n`);
