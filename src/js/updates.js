// NetWiki — mises à jour : paquets de contenu locaux (export / import) et vérification en ligne avec accord préalable.
//  - logiciel : uniquement à la demande de l'utilisateur ;
//  - wiki (.netwiki hebdomadaire) : automatiquement au démarrage si l'utilisateur l'a accepté, ou à la demande ;
//    récapitulatif des ajouts avant installation, puis redémarrage et vérification au lancement suivant.
// Copyright (c) 2026 JK-ASFC — licence MIT.
import { icon } from './icons.js';
import { confirmDialog, esc, modal, toast } from './ui.js';
import { actions, api, state } from './state.js';

const DAY = 24 * 3600 * 1000;

/** Compare deux versions « 1.44.0 » : > 0 si a est plus récente que b. */
function cmpVersion(a, b) {
  const pa = String(a).split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
}

const pl = (n, one, many) => (n > 1 ? many : one);

function summaryHtml(s) {
  const badge = s.signed
    ? `<span class="pill ok">${icon('badge-check', 13)}Signé par JK-ASFC</span>`
    : `<span class="pill warn">${icon('triangle-alert', 13)}Non signé (paquet créé localement)</span>`;
  const keep = s.keepSample.length
    ? `<p class="hint">Conservés car modifiés sur ce poste : ${s.keepSample.map((p) => `<code>${esc(p)}</code>`).join(', ')}${s.counts.keep > s.keepSample.length ? '…' : ''}</p>`
    : '';
  return `<p>${badge}</p>
    <p>${esc(s.meta.label || 'Paquet de contenu')} ${s.meta.contentVersion ? `· version ${esc(s.meta.contentVersion)}` : ''}${s.meta.created ? ` · créé le ${esc(new Date(s.meta.created).toLocaleString('fr-FR'))}` : ''}</p>
    <ul class="update-counts">
      <li><b>${s.counts.add}</b> ${pl(s.counts.add, 'nouveau fichier', 'nouveaux fichiers')}</li>
      <li><b>${s.counts.update}</b> ${pl(s.counts.update, 'fichier mis à jour', 'fichiers mis à jour')}</li>
      <li><b>${s.counts.same}</b> déjà à jour</li>
      <li><b>${s.counts.keep}</b> ${pl(s.counts.keep, 'conservé', 'conservés')} (modifiés par vous)</li>
      <li><b>${s.counts.skipDeleted}</b> ${pl(s.counts.skipDeleted, 'supprimé', 'supprimés')} par vous, non recréés</li>
    </ul>${keep}`;
}

/** Récapitulatif des ajouts : articles nouveaux / mis à jour, regroupés par catégorie puis par service. */
function changesHtml(details) {
  const section = (label, items, ic) => {
    if (!items?.length) return '';
    const groups = new Map();
    for (const it of items) {
      const key = it.category || 'Accueil';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    }
    const body = [...groups]
      .map(
        ([cat, list]) => `<div class="recap-cat"><b>${esc(cat)}</b> <span class="hint">(${list.length})</span><ul>${list
          .map((it) => `<li>${it.kind === 'image' ? icon('image', 13) : ''}${it.service ? `<span class="recap-svc">${esc(it.service)} —</span> ` : ''}${esc(it.title)}</li>`)
          .join('')}</ul></div>`
      )
      .join('');
    return `<h4 class="recap-h">${icon(ic, 15)}${esc(label)} (${items.length})</h4>${body}`;
  };
  const html = section('Nouveautés', details?.add, 'sparkles') + section('Articles et images mis à jour', details?.update, 'refresh-cw');
  return html ? `<div class="update-recap">${html}</div>` : '';
}

/** Fenêtre « NetWiki va redémarrer » avec compte à rebours, puis redémarrage. */
async function restartPopup(message, { seconds = 5 } = {}) {
  let left = seconds;
  let timer = null;
  await modal({
    title: 'Redémarrage de NetWiki',
    width: 480,
    body: `<p>${message}</p><p class="hint">Redémarrage automatique dans <b data-s>${left}</b> s…</p>`,
    actions: [{ label: 'Redémarrer maintenant', kind: 'primary', icon: 'rotate-ccw', value: true }],
    onMount: (b, finish) => {
      timer = setInterval(() => {
        left--;
        const el = b.querySelector('[data-s]');
        if (el) el.textContent = String(Math.max(0, left));
        if (left <= 0) finish(true);
      }, 1000);
    },
  });
  clearInterval(timer);
  await api.restartApp();
}

/** Applique un paquet (en ligne ou fichier) après accord, puis redémarre pour charger le nouveau contenu. */
async function applyAndRestart(summary, { title, source }) {
  const ok = await modal({
    title,
    width: 640,
    body: summaryHtml(summary) + changesHtml(summary.details),
    actions: [
      { label: 'Plus tard', kind: 'ghost', value: null },
      { label: 'Mettre à jour et redémarrer', kind: 'primary', value: true },
    ],
  });
  if (ok !== true) return false;
  const r = await api.applyPack(summary.token);
  actions.saveSettings({
    pendingUpdate: { kind: 'content', version: summary.signed ? summary.meta.contentVersion : '', source, added: r.added, updated: r.updated, at: Date.now() },
  });
  await restartPopup(`Le wiki a été mis à jour : <b>${r.added}</b> ${pl(r.added, 'nouveau fichier', 'nouveaux fichiers')}, <b>${r.updated}</b> ${pl(r.updated, 'fichier mis à jour', 'fichiers mis à jour')}. NetWiki va redémarrer pour charger les nouveaux articles.`);
  return true;
}

async function applyPack(summary) {
  if (!summary.counts.add && !summary.counts.update) {
    toast('Votre contenu est déjà à jour', 'info');
    return;
  }
  await applyAndRestart(summary, { title: 'Importer le paquet de contenu', source: 'fichier' });
}

actions.importPack = async () => {
  try {
    const summary = await api.choosePack();
    if (summary) await applyPack(summary);
  } catch (err) {
    toast(err.message || String(err), 'error', 5000);
  }
};

actions.exportPack = async () => {
  try {
    const r = await api.exportPack();
    if (r) toast(`Paquet exporté : ${r.count} fichiers`);
  } catch (err) {
    toast(err.message || String(err), 'error', 5000);
  }
};

/** Date lisible d'une version de contenu « AAAA.MM.JJ.HHMM » (« 2 novembre 2026 »). */
export function contentDate(v) {
  const m = /^(\d{4})\.(\d{2})\.(\d{2})/.exec(v || '');
  if (!m) return v || 'inconnue';
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Mise à jour du wiki (.netwiki publié chaque semaine sur GitHub) : recherche, récapitulatif des ajouts,
 * application après accord, puis redémarrage. `manual` : demandé explicitement (affiche aussi « à jour » et les erreurs).
 */
actions.checkContentUpdate = async ({ manual = false } = {}) => {
  try {
    if (manual) toast('Recherche d’une mise à jour du wiki…', 'info', 2000);
    const c = await api.checkContentUpdate();
    actions.saveSettings({ lastContentCheck: Date.now() });
    if (!c) {
      if (manual) toast('Aucun contenu publié pour le moment', 'info');
      return;
    }
    if (!c.newer) {
      if (manual) toast(`Le wiki est à jour (contenu du ${contentDate(c.installed)})`, 'info');
      return;
    }
    const summary = await api.downloadContent();
    if (!summary.counts.add && !summary.counts.update) {
      // Rien de nouveau sur ce poste : on enregistre simplement la version, sans redémarrer.
      await api.applyPack(summary.token);
      if (manual) toast(`Le wiki est à jour (contenu du ${contentDate(c.latest)})`, 'info');
      return;
    }
    await applyAndRestart(summary, { title: `Mise à jour du wiki — contenu du ${contentDate(c.latest)}`, source: 'hebdomadaire' });
  } catch (err) {
    if (manual) toast(err.message || String(err), 'error', 6000);
  }
};

let onProgress = null;
api.onUpdateProgress?.((p) => onProgress?.(p));
const mo = (n) => (n / 1048576).toFixed(1).replace('.', ',');

/** Télécharge et vérifie la nouvelle version, puis affiche la fenêtre de redémarrage. */
async function installApp(body, a) {
  const buttons = [...body.closest('.modal').querySelectorAll('.modal-foot button')];
  buttons.forEach((b) => (b.disabled = true));
  body.innerHTML = `<p>Téléchargement de NetWiki ${esc(a.latest)}…</p>
    <div class="dl-progress"><span></span></div><p class="hint" data-p>Connexion à GitHub…</p>`;
  const bar = body.querySelector('.dl-progress span');
  const label = body.querySelector('[data-p]');
  onProgress = ({ received, total }) => {
    if (total) bar.style.width = `${Math.min(100, (received / total) * 100).toFixed(1)}%`;
    label.textContent = total ? `${mo(received)} Mo sur ${mo(total)} Mo` : `${mo(received)} Mo`;
  };
  try {
    const r = await api.installAppUpdate();
    onProgress = null;
    actions.saveSettings({ pendingUpdate: { kind: 'app', version: a.latest, from: a.current, at: Date.now() } });
    return { mode: r.mode };
  } catch (err) {
    onProgress = null;
    body.innerHTML = `<p class="warn">${esc(err.message || String(err))}</p><p class="hint">Vous pouvez télécharger la nouvelle version depuis la page officielle.</p>`;
    buttons.forEach((b) => (b.disabled = false));
    return false;
  }
}

async function offerApp(a) {
  const how = {
    portable: 'Le fichier portable que vous utilisez sera remplacé par la nouvelle version, puis NetWiki redémarrera.',
    installer: 'Le nouvel installeur sera téléchargé et vérifié ; au redémarrage, il mettra à jour votre installation puis relancera NetWiki.',
  }[a.selfUpdate];
  const buttons = [{ label: 'Plus tard', kind: 'ghost', value: null }];
  buttons.push({ label: 'Page de téléchargement', kind: how ? '' : 'primary', value: 'page' });
  if (how) buttons.push({ label: 'Mettre à jour et redémarrer', kind: 'primary', value: (body) => installApp(body, a) });
  const choice = await modal({
    title: `NetWiki ${a.latest} est disponible`,
    width: 560,
    body: `<p>Version installée : ${esc(a.current)}.</p>
      ${a.notes ? `<pre class="update-notes">${esc(a.notes)}</pre>` : ''}
      <p class="hint">${how || 'Sur ce système, téléchargez la nouvelle version depuis la page officielle.'} Le fichier est vérifié (empreinte signée par JK-ASFC) avant d'être utilisé ; vos articles et vos réglages sont conservés.</p>`,
    actions: buttons,
  });
  if (choice === 'page') api.openReleasePage(a.page);
  else if (choice?.mode) {
    await restartPopup(
      choice.mode === 'portable'
        ? `NetWiki ${esc(a.latest)} est prêt (empreinte vérifiée). NetWiki va redémarrer sur la nouvelle version.`
        : `L'installeur de NetWiki ${esc(a.latest)} est prêt (empreinte vérifiée). NetWiki va se fermer, l'installeur met à jour l'installation puis relance NetWiki.`
    );
  }
}

/** Logiciel seulement, uniquement à la demande de l'utilisateur. */
actions.checkAppUpdate = async () => {
  let a;
  try {
    toast('Recherche d’une mise à jour du logiciel…', 'info', 2000);
    a = await api.checkAppUpdate();
  } catch (err) {
    toast(err.message || String(err), 'error', 5000);
    return;
  }
  if (!a.newer) {
    toast(`NetWiki est à jour (version ${a.current})`, 'info');
    return;
  }
  await offerApp(a);
};

/** Après un redémarrage : vérifie que la mise à jour annoncée est bien en place. */
async function confirmPendingUpdate() {
  const p = state.settings.pendingUpdate;
  if (!p) return;
  actions.saveSettings({ pendingUpdate: null });
  if (Date.now() - (p.at || 0) > 7 * DAY) return;
  if (p.kind === 'app') {
    const ok = cmpVersion(state.info.version, p.version) >= 0;
    if (ok) toast(`NetWiki a été mis à jour en version ${state.info.version}`, 'success', 6000);
    else
      modal({
        title: 'Mise à jour du logiciel non appliquée',
        body: `<p>NetWiki ${esc(p.version)} devait être installé, mais la version ${esc(state.info.version)} est toujours utilisée.</p>
          <p class="hint">Fermez NetWiki puis lancez le fichier téléchargé, ou téléchargez la nouvelle version depuis la page officielle.</p>`,
        actions: [
          { label: 'Fermer', kind: 'ghost', value: null },
          { label: 'Page de téléchargement', kind: 'primary', value: 'page' },
        ],
      }).then((v) => v === 'page' && api.openReleasePage('https://github.com/JK-ASFC/netwiki/releases/latest'));
    return;
  }
  const c = await api.contentInfo?.().catch(() => null);
  if (!p.version || (c?.version && c.version >= p.version)) {
    toast(`Wiki mis à jour : ${p.added} nouveau(x), ${p.updated} mis à jour${p.version ? ` (contenu du ${contentDate(p.version)})` : ''}`, 'success', 6000);
  } else {
    toast('La mise à jour du wiki n’a pas été conservée : relancez « Rechercher une mise à jour du wiki ».', 'error', 8000);
  }
}

/**
 * Au démarrage : confirme la mise à jour qui vient d'être faite, puis demande une seule fois si le wiki
 * doit être mis à jour automatiquement. Le logiciel, lui, n'est vérifié qu'à la demande (Paramètres).
 */
export async function initUpdates() {
  await confirmPendingUpdate();
  const s = state.settings;
  if (s.contentCheck === undefined || s.contentCheck === null) {
    const ok = await confirmDialog(
      'Mises à jour du wiki',
      `<p>Le contenu du wiki (articles, aide-mémoires, captures) est publié <b>chaque semaine</b> sur <b>github.com/JK-ASFC/netwiki</b> sous forme de paquet <code>.netwiki</code> signé.</p>
       <p>Voulez-vous que NetWiki <b>recherche automatiquement</b> une mise à jour du wiki à chaque démarrage ? Si une mise à jour existe, la liste des ajouts vous sera présentée avant toute installation.</p>
       <p class="hint">Requête anonyme vers GitHub, aucune donnée envoyée ; vos articles modifiés sont conservés. Le logiciel se met à jour séparément, à votre demande (Paramètres → Mises à jour). Modifiable à tout moment.</p>`,
      { ok: 'Oui, automatiquement', cancel: 'Non', html: true }
    );
    actions.saveSettings({ contentCheck: !!ok });
    if (!ok) return;
  }
  if (state.settings.contentCheck) await actions.checkContentUpdate();
}
