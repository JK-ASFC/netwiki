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
  body.innerHTML = `<p>Téléchargement de NetWiki ${esc(a.latest)}${a.size ? ` (${mo(a.size)} Mo)` : ''}…</p>
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
    const extra =
      err.code === 'INSTALL_PERMISSION'
        ? `<p class="hint">Android demande une autorisation unique : <b>Paramètres → Applications → NetWiki → Installer des applications inconnues</b>, puis relancez la mise à jour.</p>`
        : err.code === 'SIGNATURE'
          ? ''
          : '<p class="hint">Vous pouvez télécharger la nouvelle version depuis la page officielle.</p>';
    body.innerHTML = `<p class="warn">${esc(err.message || String(err))}</p>${extra}`;
    buttons.forEach((b) => (b.disabled = false));
    return false;
  }
}

async function offerApp(a) {
  const how = {
    portable: 'Le fichier portable que vous utilisez sera remplacé par la nouvelle version, puis NetWiki redémarrera.',
    installer: 'Le nouvel installeur sera téléchargé et vérifié ; au redémarrage, il mettra à jour votre installation puis relancera NetWiki.',
    android: "La nouvelle version sera téléchargée et vérifiée, puis Android vous demandera de confirmer l'installation (« Mettre à jour »).",
  }[a.selfUpdate];
  const mobileStore = state.info.mobile && !a.selfUpdate;
  const buttons = [{ label: 'Plus tard', kind: 'ghost', value: null }];
  buttons.push({ label: 'Page de téléchargement', kind: how ? '' : 'primary', value: 'page' });
  if (how) buttons.push({ label: a.selfUpdate === 'android' ? 'Télécharger et installer' : 'Mettre à jour et redémarrer', kind: 'primary', value: (body) => installApp(body, a) });
  const choice = await modal({
    title: `NetWiki ${a.latest} est disponible`,
    width: 560,
    body: `<p>Version installée : ${esc(a.current)}.</p>
      ${a.notes ? `<pre class="update-notes">${esc(a.notes)}</pre>` : ''}
      <p class="hint">${
        mobileStore
          ? 'Cette version de NetWiki est mise à jour par le magasin d’applications, ou depuis la page officielle.'
          : `${how || 'Sur ce système, téléchargez la nouvelle version depuis la page officielle.'} Le fichier est vérifié (empreinte signée par JK-ASFC) avant d'être utilisé ; vos articles et vos réglages sont conservés.`
      }</p>`,
    actions: buttons,
  });
  if (choice === null && state.info.mobile) actions.saveSettings({ appSnooze: { version: a.latest, until: Date.now() + DAY } });
  if (choice === 'page') api.openReleasePage(a.page);
  else if (choice?.mode === 'android') {
    // L'installeur d'Android prend le relais ; NetWiki est relancé sur la nouvelle version après confirmation.
    toast(`Confirmez l'installation de NetWiki ${a.latest} dans la fenêtre d'Android`, 'info', 6000);
  } else if (choice?.mode) {
    await restartPopup(
      choice.mode === 'portable'
        ? `NetWiki ${esc(a.latest)} est prêt (empreinte vérifiée). NetWiki va redémarrer sur la nouvelle version.`
        : `L'installeur de NetWiki ${esc(a.latest)} est prêt (empreinte vérifiée). NetWiki va se fermer, l'installeur met à jour l'installation puis relance NetWiki.`
    );
  }
}

/**
 * Logiciel : à la demande de l'utilisateur ; sur mobile, aussi au démarrage si l'utilisateur l'a accepté
 * (`auto` : silencieux si tout est à jour ou hors connexion, et pas plus d'une proposition par jour pour une même version).
 */
actions.checkAppUpdate = async ({ auto = false } = {}) => {
  let a;
  try {
    if (!auto) toast('Recherche d’une mise à jour du logiciel…', 'info', 2000);
    a = await api.checkAppUpdate();
    actions.saveSettings({ lastAppCheck: Date.now() });
  } catch (err) {
    if (!auto) toast(err.message || String(err), 'error', 5000);
    return;
  }
  if (!a.newer) {
    if (!auto) toast(`NetWiki est à jour (version ${a.current})`, 'info');
    return;
  }
  const snooze = state.settings.appSnooze;
  if (auto && snooze?.version === a.latest && Date.now() < snooze.until) return;
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
          <p class="hint">${
            state.info.mobile
              ? "L'installation a été annulée ou n'a pas abouti. Relancez la mise à jour : la nouvelle version sera de nouveau vérifiée avant l'installation."
              : 'Fermez NetWiki puis lancez le fichier téléchargé, ou téléchargez la nouvelle version depuis la page officielle.'
          }</p>`,
        actions: [
          { label: 'Fermer', kind: 'ghost', value: null },
          state.info.mobile && state.info.selfUpdate
            ? { label: 'Relancer la mise à jour', kind: 'primary', value: 'retry' }
            : { label: 'Page de téléchargement', kind: 'primary', value: 'page' },
        ],
      }).then((v) => {
        if (v === 'page') api.openReleasePage('https://github.com/JK-ASFC/netwiki/releases/latest');
        if (v === 'retry') actions.checkAppUpdate();
      });
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
  if (state.info.mobile) return initMobileUpdates();
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

// ================================================================ mobile (Android)

/** Active ou coupe les notifications de nouvelle version (tâche de fond d'Android, deux fois par jour). */
export async function setUpdateNotifications(on) {
  const m = api.mobile;
  if (!m) return false;
  let granted = false;
  if (on) granted = await m.requestNotifications().catch(() => false);
  const enabled = on && granted;
  actions.saveSettings({ updateNotify: enabled });
  await m.configureUpdates({ notify: enabled, contentNotify: true }).catch(() => {});
  return { enabled, denied: on && !granted };
}

/** Choix proposé une seule fois au premier lancement : recherche automatique et notifications. */
async function askMobileUpdates() {
  const r = await modal({
    title: 'Mises à jour de NetWiki',
    width: 520,
    body: `<p>NetWiki peut se tenir à jour tout seul : nouvelle version de l'application et nouveaux articles du wiki (publiés chaque semaine par JK-ASFC).</p>
      <div class="field"><div class="row"><div class="grow"><label>Rechercher automatiquement</label><div class="hint">À l'ouverture de NetWiki. Rien n'est installé sans votre accord.</div></div>
        <label class="toggle"><input type="checkbox" data-auto checked><span></span></label></div></div>
      <div class="field"><div class="row"><div class="grow"><label>M'avertir par une notification</label><div class="hint">Même quand NetWiki est fermé (vérification deux fois par jour).</div></div>
        <label class="toggle"><input type="checkbox" data-notify checked><span></span></label></div></div>
      <p class="hint">Requêtes anonymes vers github.com/JK-ASFC/netwiki, aucune donnée envoyée. Modifiable à tout moment dans Paramètres → Mises à jour.</p>`,
    actions: [{ label: 'Enregistrer', kind: 'primary', value: (b) => ({ auto: b.querySelector('[data-auto]').checked, notify: b.querySelector('[data-notify]').checked }) }],
  });
  const auto = r ? r.auto : false;
  actions.saveSettings({ appCheck: auto, contentCheck: auto });
  await setUpdateNotifications(!!r?.notify);
}

let launchHandled = false;
function handleLaunchAction(action) {
  if (action === 'app-update') actions.checkAppUpdate();
  else if (action === 'content-update') actions.checkContentUpdate({ manual: true });
}

async function initMobileUpdates() {
  const m = api.mobile;
  if (m && !launchHandled) {
    launchHandled = true;
    m.onLaunchAction(handleLaunchAction);
    const pending = await m.consumeLaunchAction().catch(() => null);
    if (pending) {
      if (state.settings.appCheck === undefined) actions.saveSettings({ appCheck: true, contentCheck: true });
      handleLaunchAction(pending);
      return;
    }
  }
  if (state.settings.appCheck === undefined || state.settings.appCheck === null) await askMobileUpdates();
  // La tâche de fond compare les nouveaux articles à la version du contenu installé.
  const c = await api.contentInfo().catch(() => null);
  m?.configureUpdates({ notify: !!state.settings.updateNotify, contentVersion: c?.version || '' }).catch(() => {});
  if (state.settings.appCheck && Date.now() - (state.settings.lastAppCheck || 0) > 6 * 3600 * 1000) await actions.checkAppUpdate({ auto: true });
  if (state.settings.contentCheck) await actions.checkContentUpdate();
}
