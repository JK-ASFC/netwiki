// Boîtes de dialogue : création d'articles / dossiers, propriétés, déplacement, sélecteur d'icône.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon, ICON_CHOICES, hasIcon } from './icons.js';
import { $, $$, esc, modal } from './ui.js';
import { ancestors, store } from './store.js';

export const TEMPLATES = {
  empty: { label: 'Article vide', body: '' },
  service: {
    label: 'Fiche service',
    body: `## Présentation

Rôle du service, cas d'usage et position dans l'architecture.

## Prérequis

- Système :
- Ports réseau :
- Dépendances :

## Installation

\`\`\`bash
# commandes d'installation
\`\`\`

## Configuration de base

## Configuration avancée

## Vérification

\`\`\`bash
# commandes de test
\`\`\`

## Dépannage

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
|  |  |  |

## Références

- Documentation officielle :
`,
  },
  procedure: {
    label: 'Procédure',
    body: `> [!NOTE] Objectif
> Décrire en une phrase le résultat attendu.

## Prérequis

- [ ] Accès administrateur
- [ ] Sauvegarde réalisée

## Étapes

1. Première étape
2. Deuxième étape
3. Troisième étape

## Validation

## Retour arrière

> [!WARNING]
> Décrire comment annuler la modification en cas de problème.
`,
  },
  commands: {
    label: 'Mémo de commandes',
    body: `## Commandes essentielles

| Commande | Description |
| --- | --- |
| \`commande\` | Description |

## Exemples

\`\`\`bash
# exemple
\`\`\`
`,
  },
};

export const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#64748b'];

function folderOptions(selected, exclude = null) {
  const opts = [`<option value="" ${selected === '' ? 'selected' : ''}>Racine du wiki</option>`];
  const walk = (f, depth) => {
    for (const c of f.children) {
      if (c.type !== 'folder') continue;
      if (exclude && (c.path === exclude || c.path.startsWith(exclude + '/'))) continue;
      opts.push(`<option value="${esc(c.path)}" ${c.path === selected ? 'selected' : ''}>${'   '.repeat(depth)}${esc(c.title)}</option>`);
      walk(c, depth + 1);
    }
  };
  walk(store.root, 1);
  return opts.join('');
}

/** Sélecteur d'icône. Renvoie le nom choisi, '' pour aucune, ou null si annulé. */
export function iconPicker(current = '') {
  let chosen = current;
  return modal({
    title: 'Choisir une icône',
    width: 560,
    body: `<div class="field"><label>Nom d'une icône Lucide ou emoji</label>
      <input class="input" id="ip-name" value="${esc(current)}" placeholder="ex. server, shield-check, 🌐"></div>
      <div class="icon-grid" id="ip-grid">${ICON_CHOICES.map(
        (n) => `<button data-n="${n}" class="${n === current ? 'on' : ''}" data-tip="${n}">${icon(n, 18)}</button>`
      ).join('')}</div>
      <p class="hint" style="margin-top:10px;font-size:12px;color:var(--text-faint)">Toutes les icônes de lucide.dev sont utilisables par leur nom.</p>`,
    actions: [
      { label: 'Aucune', kind: 'ghost', value: '' },
      { label: 'Annuler', kind: 'ghost', value: null },
      { label: 'Choisir', kind: 'primary', value: () => chosen },
    ],
    onMount: (b) => {
      const input = $('#ip-name', b);
      $('#ip-grid', b).onclick = (e) => {
        const btn = e.target.closest('button[data-n]');
        if (!btn) return;
        chosen = btn.dataset.n;
        input.value = chosen;
        $$('#ip-grid button', b).forEach((x) => x.classList.toggle('on', x === btn));
      };
      input.oninput = () => {
        chosen = input.value.trim();
        $$('#ip-grid button', b).forEach((x) => x.classList.toggle('on', x.dataset.n === chosen));
      };
    },
  });
}

/** Nouvel article : renvoie { title, folder, template } ou null. */
export function newPageDialog(folderPath = '') {
  return modal({
    title: 'Nouvel article',
    width: 520,
    body: `<div class="field"><label>Titre</label><input class="input" id="np-title" placeholder="ex. Configuration du NTP sur Cisco IOS"></div>
      <div class="field"><label>Emplacement</label><select class="input" id="np-folder">${folderOptions(folderPath)}</select></div>
      <div class="field"><label>Modèle</label><select class="input" id="np-tpl">${Object.entries(TEMPLATES)
        .map(([k, t]) => `<option value="${k}">${esc(t.label)}</option>`)
        .join('')}</select></div>`,
    actions: [
      { label: 'Annuler', kind: 'ghost', value: null },
      {
        label: 'Créer et modifier',
        kind: 'primary',
        icon: 'file-plus',
        value: (b) => {
          const title = $('#np-title', b).value.trim();
          if (!title) {
            $('#np-title', b).focus();
            return false;
          }
          return { title, folder: $('#np-folder', b).value, template: $('#np-tpl', b).value };
        },
      },
    ],
  });
}

function folderForm(meta = {}, parentPath = null) {
  return `<div class="field"><label>Nom du dossier</label><input class="input" id="nf-title" value="${esc(meta.title || '')}" placeholder="ex. Cisco IOS-XE"></div>
    <div class="field"><label>Description</label><input class="input" id="nf-desc" value="${esc(meta.description || '')}" placeholder="Affichée sur les cartes et la page du dossier"></div>
    ${parentPath !== null ? `<div class="field"><label>Dossier parent</label><select class="input" id="nf-parent">${folderOptions(parentPath)}</select></div>` : ''}
    <div class="field"><label>Icône</label><div class="row"><button class="icon-pick" id="nf-icon">${icon(meta.icon || 'folder', 18)}</button>
      <span class="hint" id="nf-icon-name">${esc(meta.icon || 'folder (par défaut)')}</span></div></div>
    <div class="field"><label>Couleur</label><div class="swatches" id="nf-colors">
      <button class="swatch ${!meta.color ? 'on' : ''}" data-c="" style="--sw:conic-gradient(#888 0 25%,#bbb 0 50%,#888 0 75%,#bbb 0)" data-tip="Héritée"></button>
      ${COLORS.map((c) => `<button class="swatch ${meta.color === c ? 'on' : ''}" data-c="${c}" style="--sw:${c}"></button>`).join('')}</div></div>`;
}

function wireFolderForm(b, state) {
  $('#nf-icon', b).onclick = async () => {
    const chosen = await iconPicker(state.icon || '');
    if (chosen === null) return;
    state.icon = chosen;
    $('#nf-icon', b).innerHTML = icon(chosen || 'folder', 18);
    $('#nf-icon-name', b).textContent = chosen || 'folder (par défaut)';
  };
  $('#nf-colors', b).onclick = (e) => {
    const sw = e.target.closest('.swatch');
    if (!sw) return;
    state.color = sw.dataset.c;
    $$('.swatch', b).forEach((x) => x.classList.toggle('on', x === sw));
  };
}

function collectFolder(b, st) {
  const title = $('#nf-title', b).value.trim();
  if (!title) {
    $('#nf-title', b).focus();
    return false;
  }
  const meta = { ...st.base, title, description: $('#nf-desc', b).value.trim() };
  if (st.icon) meta.icon = st.icon;
  else delete meta.icon;
  if (st.color) meta.color = st.color;
  else delete meta.color;
  if (!meta.description) delete meta.description;
  const parent = $('#nf-parent', b);
  return { meta, parent: parent ? parent.value : null };
}

export function newFolderDialog(parentPath = '') {
  const st = { icon: '', color: '', base: {} };
  return modal({
    title: 'Nouveau dossier',
    width: 520,
    body: folderForm({}, parentPath),
    actions: [
      { label: 'Annuler', kind: 'ghost', value: null },
      { label: 'Créer', kind: 'primary', icon: 'folder-plus', value: (b) => collectFolder(b, st) },
    ],
    onMount: (b) => wireFolderForm(b, st),
  });
}

export function folderPropsDialog(folder) {
  const st = { icon: folder.meta.icon || '', color: folder.meta.color || '', base: { ...folder.meta } };
  return modal({
    title: 'Propriétés du dossier',
    width: 520,
    body: folderForm(folder.meta.title ? folder.meta : { ...folder.meta, title: folder.title }),
    actions: [
      { label: 'Annuler', kind: 'ghost', value: null },
      { label: 'Enregistrer', kind: 'primary', icon: 'save', value: (b) => collectFolder(b, st) },
    ],
    onMount: (b) => wireFolderForm(b, st),
  });
}

/** Choix d'un dossier de destination. */
export function moveDialog(node) {
  const current = node.parent ? node.parent.path : '';
  return modal({
    title: `Déplacer « ${node.title} »`,
    width: 480,
    body: `<div class="field"><label>Nouvel emplacement</label><select class="input" id="mv-folder">${folderOptions(
      current,
      node.type === 'folder' ? node.path : null
    )}</select></div>
      <p style="font-size:12.5px">Les liens relatifs pointant vers cet élément devront peut-être être mis à jour. Les liens wiki <code>[[Titre]]</code> continuent de fonctionner.</p>`,
    actions: [
      { label: 'Annuler', kind: 'ghost', value: null },
      { label: 'Déplacer', kind: 'primary', icon: 'folder-input', value: (b) => $('#mv-folder', b).value },
    ],
  });
}

export function breadcrumbLabel(node) {
  return ancestors(node)
    .map((a) => a.title)
    .concat(node.title)
    .join(' › ');
}

export { hasIcon };
