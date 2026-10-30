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

/** Vérifie la dernière version publiée. `manual` : demandé explicitement (affiche aussi « à jour » et les erreurs). */
actions.checkUpdates = async ({ manual = false } = {}) => {
  let info;
  try {
    info = await api.checkUpdates();
    actions.saveSettings({ lastUpdateCheck: Date.now() });
  } catch (err) {
    if (manual) toast(err.message || String(err), 'error', 5000);
    return;
  }
  if (!info.newer) {
    if (manual) toast(`NetWiki est à jour (version ${info.current})`, 'info');
    return;
  }
  if (!manual && state.settings.skippedVersion === info.latest) return;
  const buttons = [];
  if (info.pack) buttons.push({ label: 'Mettre à jour le contenu', kind: 'primary', value: 'pack' });
  buttons.push({ label: 'Page de téléchargement', value: 'page' });
  buttons.push({ label: 'Ignorer cette version', kind: 'ghost', value: 'skip' });
  const choice = await modal({
    title: `NetWiki ${info.latest} est disponible`,
    width: 560,
    body: `<p>Version installée : ${esc(info.current)}.</p>
      ${info.notes ? `<pre class="update-notes">${esc(info.notes)}</pre>` : ''}
      <p class="hint">Le contenu peut être mis à jour ici (paquet signé par JK-ASFC, vos modifications sont conservées). Pour une nouvelle version de l'application, téléchargez l'installeur depuis la page officielle.</p>`,
    actions: buttons,
  });
  if (choice === 'skip') actions.saveSettings({ skippedVersion: info.latest });
  else if (choice === 'page') api.openReleasePage(info.page);
  else if (choice === 'pack') {
    try {
      toast('Téléchargement et vérification du paquet…', 'info');
      const summary = await api.downloadPack(info.pack.url);
      await applyPack(summary);
    } catch (err) {
      toast(err.message || String(err), 'error', 6000);
    }
  }
};

/** Au démarrage : demande l'autorisation une seule fois, puis vérifie au plus une fois par jour. */
export async function initUpdates() {
  const s = state.settings;
  if (s.updateConsent === undefined || s.updateConsent === null) {
    const ok = await confirmDialog(
      'Vérification des mises à jour',
      `<p>NetWiki peut vérifier au démarrage (au plus une fois par jour) si une nouvelle version est publiée sur <b>github.com/JK-ASFC/netwiki</b>.</p>
       <p class="hint">Seule une requête anonyme vers GitHub est effectuée : aucune donnée personnelle ni aucun contenu de votre wiki n'est envoyé. Vous pourrez changer d'avis dans les Paramètres.</p>`,
      { ok: 'Autoriser', cancel: 'Ne pas vérifier', html: true }
    );
    actions.saveSettings({ updateConsent: !!ok });
    if (!ok) return;
  }
  if (s.updateConsent && Date.now() - (s.lastUpdateCheck || 0) > DAY) actions.checkUpdates();
}
