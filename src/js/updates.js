// NetWiki — mises à jour : paquets de contenu locaux (export / import) et vérification en ligne avec accord préalable.
// Copyright (c) 2026 JK-ASFC — licence MIT.
import { icon } from './icons.js';
import { confirmDialog, esc, modal, toast } from './ui.js';
import { actions, api, state } from './state.js';

const DAY = 24 * 3600 * 1000;

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
      <li><b>${s.counts.add}</b> nouveaux fichiers</li>
      <li><b>${s.counts.update}</b> fichiers mis à jour</li>
      <li><b>${s.counts.same}</b> déjà à jour</li>
      <li><b>${s.counts.keep}</b> conservés (modifiés par vous)</li>
      <li><b>${s.counts.skipDeleted}</b> supprimés par vous, non recréés</li>
    </ul>${keep}`;
}

async function applyPack(summary) {
  if (!summary.counts.add && !summary.counts.update) {
    toast('Votre contenu est déjà à jour', 'info');
    return;
  }
  const ok = await confirmDialog('Appliquer le paquet de contenu', summaryHtml(summary), { ok: 'Appliquer', html: true });
  if (!ok) return;
  const r = await api.applyPack(summary.token);
  await actions.reload(true);
  toast(`${r.added} ajouté(s), ${r.updated} mis à jour`);
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

/** Contenu hebdomadaire : téléchargé, vérifié (signature JK-ASFC) puis appliqué ; vos modifications sont conservées. */
async function updateContent(c, { manual }) {
  try {
    const summary = await api.downloadContent();
    const changes = summary.counts.add + summary.counts.update;
    if (changes && state.settings.contentAuto === false) {
      const ok = await confirmDialog(`Contenu du wiki du ${contentDate(c.latest)}`, summaryHtml(summary), { ok: 'Appliquer', html: true });
      if (!ok) return;
    }
    // Appliqué même sans changement : la version du contenu installé est ainsi enregistrée.
    const r = await api.applyPack(summary.token);
    if (changes) {
      await actions.reload(true);
      toast(`Contenu du wiki mis à jour (${contentDate(c.latest)}) : ${r.added} nouveau(x), ${r.updated} mis à jour`, 'success', 6000);
    } else if (manual) {
      toast(`Le contenu du wiki est à jour (${contentDate(c.latest)})`, 'info');
    }
  } catch (err) {
    if (manual) toast(err.message || String(err), 'error', 6000);
  }
}

let onProgress = null;
api.onUpdateProgress?.((p) => onProgress?.(p));
const mo = (n) => (n / 1048576).toFixed(1).replace('.', ',');

/** Télécharge et installe la nouvelle version (portable remplacé sur place, ou installeur lancé). */
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
    body.innerHTML =
      r.mode === 'portable'
        ? `<p>${icon('badge-check', 16)} Empreinte vérifiée, fichier portable remplacé : NetWiki redémarre en version ${esc(a.latest)}…</p>`
        : `<p>${icon('badge-check', 16)} Empreinte vérifiée : l'installeur de NetWiki ${esc(a.latest)} se lance et va fermer NetWiki…</p>`;
  } catch (err) {
    body.innerHTML = `<p class="warn">${esc(err.message || String(err))}</p><p class="hint">Vous pouvez télécharger la nouvelle version depuis la page officielle.</p>`;
    buttons.forEach((b) => (b.disabled = false));
  } finally {
    onProgress = null;
  }
  return false;
}

async function offerApp(a) {
  const how = {
    portable: 'Le fichier portable que vous utilisez sera remplacé par la nouvelle version, puis NetWiki redémarrera.',
    installer: 'Le nouvel installeur sera téléchargé puis lancé : il fermera NetWiki et mettra à jour votre installation.',
  }[a.selfUpdate];
  const buttons = [];
  if (how) buttons.push({ label: 'Mettre à jour maintenant', kind: 'primary', value: (body) => installApp(body, a) });
  buttons.push({ label: 'Page de téléchargement', kind: how ? '' : 'primary', value: 'page' });
  buttons.push({ label: 'Ignorer cette version', kind: 'ghost', value: 'skip' });
  const choice = await modal({
    title: `NetWiki ${a.latest} est disponible`,
    width: 560,
    body: `<p>Version installée : ${esc(a.current)}.</p>
      ${a.notes ? `<pre class="update-notes">${esc(a.notes)}</pre>` : ''}
      <p class="hint">${how || 'Téléchargez la nouvelle version depuis la page officielle.'} Le fichier est vérifié (empreinte signée par JK-ASFC) avant d'être utilisé ; vos articles et vos réglages sont conservés.</p>`,
    actions: buttons,
  });
  if (choice === 'skip') actions.saveSettings({ skippedVersion: a.latest });
  else if (choice === 'page') api.openReleasePage(a.page);
}

/** Vérifie le contenu (publication hebdomadaire) et le logiciel. `manual` : demandé explicitement (affiche aussi « à jour » et les erreurs). */
actions.checkUpdates = async ({ manual = false } = {}) => {
  let info;
  try {
    info = await api.checkUpdates();
    actions.saveSettings({ lastUpdateCheck: Date.now() });
  } catch (err) {
    if (manual) toast(err.message || String(err), 'error', 5000);
    return;
  }
  if (info.content?.newer) await updateContent(info.content, { manual });
  else if (manual && info.content) toast(`Le contenu du wiki est à jour (${contentDate(info.content.installed)})`, 'info');
  else if (manual && info.contentError) toast(info.contentError, 'error', 5000);

  const a = info.app;
  if (!a) {
    if (manual && info.appError) toast(info.appError, 'error', 5000);
    return;
  }
  if (!a.newer) {
    if (manual) toast(`NetWiki est à jour (version ${a.current})`, 'info');
    return;
  }
  if (!manual && state.settings.skippedVersion === a.latest) return;
  await offerApp(a);
};

/** Au démarrage : demande l'autorisation une seule fois, puis vérifie au plus une fois par jour. */
export async function initUpdates() {
  const s = state.settings;
  if (s.updateConsent === undefined || s.updateConsent === null) {
    const ok = await confirmDialog(
      'Vérification des mises à jour',
      `<p>NetWiki peut vérifier au démarrage (au plus une fois par jour) si une nouvelle version du <b>logiciel</b> ou du <b>contenu du wiki</b> (publié chaque semaine) est disponible sur <b>github.com/JK-ASFC/netwiki</b>.</p>
       <p class="hint">Seules des requêtes anonymes vers GitHub sont effectuées : aucune donnée personnelle ni aucun contenu de votre wiki n'est envoyé. Les mises à jour sont signées par JK-ASFC et vos modifications sont conservées. Vous pourrez changer d'avis dans les Paramètres.</p>`,
      { ok: 'Autoriser', cancel: 'Ne pas vérifier', html: true }
    );
    actions.saveSettings({ updateConsent: !!ok });
    if (!ok) return;
  }
  if (s.updateConsent && Date.now() - (s.lastUpdateCheck || 0) > DAY) actions.checkUpdates();
}
