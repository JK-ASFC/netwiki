// Suivi du catalogue des services (docs/catalogue/catalogue-services.txt) face au contenu du wiki.
//   node scripts/catalogue.mjs            → met à jour docs/catalogue/suivi.json et docs/catalogue/SUIVI.md
//   node scripts/catalogue.mjs --suivant 10 → affiche les 10 prochains services à rédiger (ordre du catalogue)
//
// suivi.json est la source de vérité de l'avancement : les champs saisis à la main ou par l'agent
// (statut « fait » / « ameliore », lot, wiki, cible, depot, eol) sont conservés à chaque exécution.
// Statuts : existant (déjà dans le wiki avant le catalogue) · a-faire · fait (nouvelle fiche) · ameliore (fiche existante enrichie).
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'docs', 'catalogue');
const content = path.join(root, 'content');
const SUIVI = path.join(dir, 'suivi.json');

const norm = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.+#]+/g, ' ')
    .trim();
const slug = (s) => norm(s).replace(/[.+#]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

// ---------------------------------------------------------------- catalogue
function parseCatalogue() {
  const lines = fs.readFileSync(path.join(dir, 'catalogue-services.txt'), 'utf8').split(/\r?\n/);
  const out = [];
  let section = null;
  for (const l of lines) {
    const h = /^(\d+)\.\s+(.+)$/.exec(l);
    if (h) {
      section = { no: Number(h[1]), titre: h[2].trim() };
      continue;
    }
    const m = /^-\s+(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*$/.exec(l);
    if (m && section) out.push({ nom: m[1], role: m[2], plateformes: m[3], section: section.no, sectionTitre: section.titre });
  }
  return out;
}

// ---------------------------------------------------------------- index du wiki (dossiers de service et articles d'outils)
function folderTitle(p) {
  try {
    return JSON.parse(fs.readFileSync(path.join(p, '_folder.json'), 'utf8')).title || path.basename(p);
  } catch {
    return path.basename(p);
  }
}
function wikiIndex() {
  const idx = [];
  const add = (title, wiki) => {
    const parts = String(title)
      .split(/\s+\/\s+|\s+et\s+|\s+—\s+|[(),;]/)
      .map((s) => s.replace(/^\+\s*/, '').trim())
      .filter((s) => s.length > 1);
    for (const v of new Set([title, ...parts])) idx.push({ v: norm(v), wiki });
  };
  for (const cat of fs.readdirSync(content)) {
    const cp = path.join(content, cat);
    if (!fs.statSync(cp).isDirectory()) continue;
    for (const svc of fs.readdirSync(cp)) {
      const sp = path.join(cp, svc);
      if (!fs.statSync(sp).isDirectory() || svc === '_assets') continue;
      add(folderTitle(sp), `${cat}/${svc}`);
      // Outils et services regroupés : chaque article peut couvrir un logiciel (« Wireshark — capture », « Transmission »…)
      if (/outils|multimedia/.test(cat)) {
        for (const f of fs.readdirSync(sp).filter((f) => f.endsWith('.md') && !f.startsWith('90-'))) {
          const t = /^title:\s*(.+)$/m.exec(fs.readFileSync(path.join(sp, f), 'utf8'))?.[1];
          if (t) add(t.replace(/\s+—.*$/, ''), `${cat}/${svc}/${f.replace(/\.md$/, '')}`);
        }
      }
    }
  }
  return idx.filter((e) => e.v.length > 1);
}

// Variantes de noms du catalogue sans équivalent textuel direct dans le wiki
const ALIAS = {
  'docker engine': 'docker',
  mariadb: 'mariadb',
  mysql: 'mysql',
  valkey: 'valkey',
  'microsoft sql server express': 'microsoft sql server',
  'sql server': 'microsoft sql server',
  'vmware workstation player': 'vmware workstation pro',
  'openssh server': 'openssh',
  'isc kea': 'kea dhcp',
  kea: 'kea dhcp',
  'isc dhcp server': 'isc dhcp',
  'bind 9': 'bind9',
  bind: 'bind9',
  'mit kerberos': 'kerberos',
  'hashicorp vault': 'hashicorp vault',
  'apache tomcat': 'apache tomcat',
  'apache http server': 'apache http server',
  'apache httpd': 'apache http server',
  'redis': 'redis',
  'elastic stack': 'elasticsearch',
  'opentofu': 'opentofu',
  'zabbix server': 'zabbix',
  'nagios core': 'nagios',
  'icinga': 'icinga 2',
  'checkmk raw': 'checkmk',
  'squid cache': 'squid',
  'varnish': 'varnish cache',
  'nginx open source': 'nginx',
  'ntpsec': 'ntpsec',
  'chrony': 'chrony',
  'cups': 'impression',
  'rustdesk server': 'rustdesk',
  'open webui': 'open webui',
  'puppet': 'puppet',
  'salt project': 'salt',
  'saltstack': 'salt',
  'owncloud infinite scale': 'owncloud',
  'mailman': 'mailman 3',
  'vsftpd': 'vsftpd',
  'tftp-hpa': 'tftp',
  'wazuh manager': 'wazuh',
  'graylog open': 'graylog',
  'splunk free': 'splunk enterprise',
  'k3s': 'k3s',
  'minikube': 'minikube',
  'kind': 'kind',
  'portainer ce': 'portainer',
};

// Mots trop génériques pour rattacher un service par préfixe (« Windows Terminal » n'est pas « Impression (CUPS, Windows) »)
const GENERIQUES = new Set(['windows', 'microsoft', 'apache', 'serveur', 'server', 'services', 'service', 'impression', 'cups', 'linux', 'open source', 'cloud', 'cisco', 'git']);
// Faux amis : services distincts malgré un nom proche d'une fiche existante
const NOUVEAUX = new Set(['ansible nas', 'ansible semaphore', 'docker mailserver', 'nginx ingress controller', 'powershell', 'grafana loki', 'grafana tempo', 'grafana mimir', 'grafana alloy']);

function match(nom, idx) {
  const n = norm(nom);
  if (NOUVEAUX.has(n)) return null;
  const cands = [n, ALIAS[n]].filter(Boolean);
  for (const c of cands) {
    const exact = idx.find((e) => e.v === c);
    if (exact) return exact.wiki;
  }
  // Nom du catalogue plus précis que la fiche (« Docker Engine » → Docker, « Samba AD DC » → Samba)
  let best = null;
  for (const c of cands) {
    for (const e of idx) {
      if (GENERIQUES.has(e.v) || !c.startsWith(e.v + ' ')) continue;
      if (!best || e.v.length > best.v.length) best = e;
    }
  }
  return best?.wiki || null;
}

// ---------------------------------------------------------------- catégorie cible des nouvelles fiches
export const NOUVELLES_CATEGORIES = {
  '24-systemes-exploitation': { title: "Systèmes d'exploitation", icon: 'hard-drive', color: '#f97316', description: 'Distributions Linux, BSD, NAS et plateformes d’auto-hébergement : installation, administration et mises à jour.' },
  '25-web-cms-portails': { title: 'Web : CMS, e-commerce & portails', icon: 'layout-template', color: '#0ea5e9', description: 'CMS, wikis publics, e-commerce, LMS et portails : installation, sécurisation et administration.' },
  '26-gestion-parc': { title: 'Gestion de parc & services Windows', icon: 'monitor-cog', color: '#64748b', description: 'Inventaire, déploiement, impression, assistance et outils d’administration du poste de travail.' },
  '27-data-analytique': { title: 'Data, big data & streaming', icon: 'chart-network', color: '#14b8a6', description: 'Traitement et analyse de données, entrepôts, orchestration de flux et streaming.' },
  '28-ia-machine-learning': { title: 'IA & machine learning', icon: 'brain-circuit', color: '#a855f7', description: 'Inférence locale, LLM auto-hébergés, MLOps et bases vectorielles.' },
  '29-documentation-ged': { title: 'Documentation, GED & connaissance', icon: 'book-open-text', color: '#eab308', description: 'Wikis, gestion électronique de documents, moteurs de recherche et bases de connaissances.' },
  '30-developpement-api': { title: 'Développement, API & tests', icon: 'code-xml', color: '#3b82f6', description: 'Passerelles d’API, outils de test, environnements de développement et qualité.' },
  '31-auto-hebergement': { title: 'Services auto-hébergés', icon: 'house-wifi', color: '#22c55e', description: 'Tableaux de bord, outils personnels et services de plateforme à héberger soi-même.' },
};

function cible(e) {
  const r = norm(e.role);
  const has = (...k) => k.some((x) => r.includes(x));
  switch (e.section) {
    case 1:
      if (has('virtualis', 'hyperviseur', 'conteneur', 'cloud', 'microvm', 'emulation', 'runtime')) return '13-conteneurs';
      if (has('sauvegarde')) return '19-sauvegarde';
      if (has('nas', 'stockage')) return '09-fichiers-partage';
      return '24-systemes-exploitation';
    case 2:
      return has('radius', 'tacacs', '2fa', 'mfa', 'otp') ? '04-aaa' : '01-annuaire-identite';
    case 3:
      if (has('dhcp')) return '03-dhcp';
      if (has('dns')) return '02-dns';
      return '18-infrastructure-systeme';
    case 4:
      return has('vpn', 'passerelle d acces', 'bastion') ? '08-acces-distant-vpn' : '07-proxy-cache';
    case 5:
      return '05-web';
    case 6:
      return '11-bases-de-donnees';
    case 7:
      return has('sauvegarde', 'backup', 'replication') ? '19-sauvegarde' : '09-fichiers-partage';
    case 8:
      return '13-conteneurs';
    case 9:
      return has('log', 'journal', 'siem') ? '15-journalisation' : '06-supervision';
    case 10:
      if (has('siem', 'log')) return '15-journalisation';
      if (has('vpn')) return '08-acces-distant-vpn';
      return '16-securite';
    case 11:
      return '17-automatisation';
    case 12:
      return has('voip', 'telephon', 'ipbx', 'pbx', 'sip') ? '23-telephonie-ip' : '10-messagerie';
    case 13:
      return '25-web-cms-portails';
    case 14:
      return '14-devops';
    case 15:
      return '26-gestion-parc';
    case 16:
      return '21-outils';
    case 17:
      return '20-multimedia-services';
    case 18:
      return has('dns') ? '02-dns' : '10-messagerie';
    case 19:
      return has('broker', 'message', 'file', 'mqtt', 'queue', 'evenement', 'event') ? '12-recherche-messages' : '27-data-analytique';
    case 20:
      return '28-ia-machine-learning';
    case 21:
      return has('recherche', 'search', 'index') ? '12-recherche-messages' : '29-documentation-ged';
    case 22:
      if (has('vpn', 'acces distant', 'bureau a distance', 'ssh', 'transfert', 'ftp')) return '08-acces-distant-vpn';
      return '21-outils';
    case 23:
      return '26-gestion-parc';
    case 24:
      return '30-developpement-api';
    case 25:
      return '31-auto-hebergement';
    default:
      return '21-outils';
  }
}

// ---------------------------------------------------------------- suivi
const idx = wikiIndex();
const old = fs.existsSync(SUIVI) ? JSON.parse(fs.readFileSync(SUIVI, 'utf8')) : { services: [] };
const oldById = new Map(old.services.map((s) => [s.id, s]));
const seen = new Map();
const services = parseCatalogue().map((e) => {
  let id = slug(e.nom);
  // Doublons du catalogue (même service listé dans deux sections) : même fiche, identifiant suffixé
  if (seen.has(id)) id = `${id}-${e.section}`;
  seen.set(id, true);
  const prev = oldById.get(id);
  // Une fois le service suivi, seul l'état enregistré fait foi (une nouvelle fiche ne doit pas devenir « existante »).
  const wiki = prev ? prev.wiki : match(e.nom, idx);
  const statut = prev ? prev.statut : wiki ? 'existant' : 'a-faire';
  return {
    id,
    nom: e.nom,
    role: e.role,
    plateformes: e.plateformes,
    section: e.section,
    statut,
    wiki: wiki || null,
    cible: prev?.cible || (wiki ? wiki.split('/')[0] : cible(e)),
    lot: prev?.lot ?? null,
    depot: prev?.depot ?? null,
    eol: prev?.eol ?? null,
    _sectionTitre: e.sectionTitre,
  };
});

const doublons = new Map();
for (const s of services) {
  const k = norm(s.nom);
  doublons.set(k, (doublons.get(k) || 0) + 1);
}

const args = process.argv.slice(2);
const opt = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
// node scripts/catalogue.mjs --marquer id1,id2 --wiki 13-conteneurs/14-kvm --lot 48 [--statut ameliore] [--depot o/r] [--eol produit]
if (args[0] === '--marquer') {
  const ids = String(args[1] || '').split(',').filter(Boolean);
  for (const id of ids) {
    const s = services.find((x) => x.id === id);
    if (!s) {
      console.error(`Service inconnu : ${id}`);
      process.exitCode = 1;
      continue;
    }
    s.statut = opt('--statut') || (s.statut === 'existant' ? 'ameliore' : 'fait');
    if (opt('--wiki')) s.wiki = opt('--wiki');
    if (opt('--wiki')) s.cible = opt('--wiki').split('/')[0];
    if (opt('--lot')) s.lot = /^\d+$/.test(opt('--lot')) ? Number(opt('--lot')) : opt('--lot');
    if (opt('--depot')) s.depot = opt('--depot');
    if (opt('--eol')) s.eol = opt('--eol');
  }
}
if (args[0] === '--suivant') {
  const n = Number(args[1]) || 10;
  const next = services.filter((s) => s.statut === 'a-faire').slice(0, n);
  for (const s of next) console.log(`${s.id}\t${s.nom}\t${s.role}\t${s.plateformes}\t→ ${s.cible}`);
  process.exit(0);
}

const sections = [...new Map(services.map((s) => [s.section, s._sectionTitre])).entries()];
const json = {
  genere: new Date().toISOString().slice(0, 10),
  total: services.length,
  categoriesNouvelles: NOUVELLES_CATEGORIES,
  sections: Object.fromEntries(sections),
  services: services.map(({ _sectionTitre, ...s }) => s),
};
fs.writeFileSync(SUIVI, JSON.stringify(json, null, 1) + '\n');

// ---------------------------------------------------------------- SUIVI.md (lisible)
const count = (st) => services.filter((s) => s.statut === st).length;
const pct = (n) => `${Math.round((n / services.length) * 100)} %`;
const ICON = { existant: '✅ existant', fait: '🆕 fait', ameliore: '✨ amélioré', 'a-faire': '⏳ à faire' };
let md = `# Suivi du catalogue des services\n\n`;
md += `Généré par \`node scripts/catalogue.mjs\` à partir de [catalogue-services.txt](catalogue-services.txt) et du contenu du wiki. Source de vérité : [suivi.json](suivi.json).\n\n`;
md += `| Total | Déjà dans le wiki | Nouvelles fiches | Fiches améliorées | Reste à faire |\n| --- | --- | --- | --- | --- |\n`;
md += `| ${services.length} | ${count('existant')} (${pct(count('existant'))}) | ${count('fait')} | ${count('ameliore')} | ${count('a-faire')} (${pct(count('a-faire'))}) |\n\n`;
md += `Méthode de rédaction : [METHODE.md](METHODE.md).\n\n`;
for (const [no, titre] of sections) {
  const list = services.filter((s) => s.section === no);
  const done = list.filter((s) => s.statut !== 'a-faire').length;
  md += `## ${no}. ${titre} — ${done}/${list.length}\n\n| Service | Rôle | Plateformes | État | Fiche / cible |\n| --- | --- | --- | --- | --- |\n`;
  for (const s of list) {
    const where = s.wiki ? `\`${s.wiki}\`` : `→ \`${s.cible}\``;
    md += `| ${s.nom.replace(/\|/g, '\\|')} | ${s.role.replace(/\|/g, '\\|')} | ${s.plateformes.replace(/\|/g, '\\|')} | ${ICON[s.statut] || s.statut}${s.lot ? ` (lot ${s.lot})` : ''} | ${where} |\n`;
  }
  md += '\n';
}
fs.writeFileSync(path.join(dir, 'SUIVI.md'), md);
console.log(
  `Catalogue : ${services.length} services · existants ${count('existant')} · faits ${count('fait')} · améliorés ${count('ameliore')} · à faire ${count('a-faire')} · noms en double ${[...doublons.values()].filter((n) => n > 1).length}`
);
