// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon } from '../icons.js';
import { $, $$, confirmDialog, esc, modal, toast } from '../ui.js';
import { COLORS } from '../dialogs.js';
import { actions, api, state } from '../state.js';
import { openAbout } from '../legal.js';
import { contentDate, setUpdateNotifications } from '../updates.js';

export function openSettings() {
  const s = state.settings;
  const themeBtn = (v, label, ic) => `<button data-theme-v="${v}" class="${s.theme === v ? 'on' : ''}">${icon(ic, 14)}${label}</button>`;
  modal({
    title: 'Paramètres',
    width: 600,
    body: `
      <div class="field"><label>Thème</label>
        <div class="segmented" id="st-theme"><span class="thumb"></span>${themeBtn('dark', 'Sombre', 'moon')}${themeBtn('light', 'Clair', 'sun')}${themeBtn('system', 'Système', 'monitor')}</div></div>
      <div class="field"><label>Couleur d'accent</label><div class="swatches" id="st-accent">${COLORS.slice(0, 10)
        .map((c) => `<button class="swatch ${s.accent === c ? 'on' : ''}" data-c="${c}" style="--sw:${c}"></button>`)
        .join('')}</div></div>
      <div class="field"><label>Taille du texte : <b id="st-fs-v">${s.fontSize}px</b></label>
        <input type="range" id="st-fs" min="13" max="20" step="1" value="${s.fontSize}" style="accent-color:var(--accent)"></div>
      <div class="field"><div class="row"><div class="grow"><label>Largeur de lecture étendue</label><div class="hint">Utilise plus d'espace horizontal pour les articles.</div></div>
        <label class="toggle"><input type="checkbox" id="st-wide" ${s.readingWidth === 'wide' ? 'checked' : ''}><span></span></label></div></div>
      <div class="field"><div class="row"><div class="grow"><label>Table des matières</label><div class="hint">Sommaire « Sur cette page » à droite des articles.</div></div>
        <label class="toggle"><input type="checkbox" id="st-toc" ${s.showToc !== false ? 'checked' : ''}><span></span></label></div></div>
      <div class="field"><div class="row"><div class="grow"><label>Effets visuels</label><div class="hint">Fond animé, flou de verre et animations. À désactiver sur une machine peu puissante.</div></div>
        <label class="toggle"><input type="checkbox" id="st-fx" ${s.effects !== false ? 'checked' : ''}><span></span></label></div></div>
      <div class="field"><div class="row"><div class="grow"><label>Écran de démarrage</label><div class="hint">Logo et terminal animé à l'ouverture de NetWiki.</div></div>
        <label class="toggle"><input type="checkbox" id="st-splash" ${s.showSplash !== false ? 'checked' : ''}><span></span></label></div></div>
      ${state.info.mobile ? `      <div class="field"><label>Mises à jour</label>
        <div class="row"><div class="grow"><b style="font-size:13px">Application</b><div class="hint" style="margin:0">Version installée : ${esc(state.info.version)}.${state.info.selfUpdate ? ' Téléchargée et vérifiée (signature de JK-ASFC) avant installation.' : ''}</div></div>
          <button class="btn sm" id="st-check-app">${icon('refresh-cw', 15)}Rechercher</button></div>
        <div class="row" style="margin-top:10px"><div class="grow"><b style="font-size:13px">Recherche automatique</b><div class="hint" style="margin:0">À l'ouverture : nouvelle version de l'application et nouveaux articles du wiki. Rien n'est installé sans votre accord.</div></div>
          <label class="toggle"><input type="checkbox" id="st-auto" ${s.appCheck ? 'checked' : ''}><span></span></label></div>
        <div class="row" style="margin-top:10px"><div class="grow"><b style="font-size:13px">Notifications</b><div class="hint" style="margin:0" id="st-notify-hint">Être averti d'une nouvelle version ou de nouveaux articles, même quand NetWiki est fermé.</div></div>
          <label class="toggle"><input type="checkbox" id="st-notify" ${s.updateNotify ? 'checked' : ''}><span></span></label></div>
        <div class="row" style="margin-top:10px"><div class="grow"><b style="font-size:13px">Wiki</b><div class="hint" style="margin:0">Articles publiés chaque semaine (paquet .netwiki signé). <span id="st-content-ver"></span></div></div>
          <button class="btn sm" id="st-check-content">${icon('refresh-cw', 15)}Rechercher</button></div>
        <div class="row st-wrap" style="margin-top:8px"><button class="btn sm" id="st-import">${icon('package-open', 15)}Importer un paquet…</button>
          <span class="grow"></span><button class="btn sm ghost" id="st-restore">${icon('archive-restore', 15)}Restaurer le contenu d'origine</button></div>
        <div class="hint">Requêtes anonymes vers github.com/JK-ASFC/netwiki, aucune donnée envoyée. Vos articles modifiés ne sont jamais écrasés.</div></div>
` : `      <div class="field"><label>Dossier des données</label>
        <div class="row"><input class="input grow" readonly value="${esc(state.info.dataDir)}" id="st-dir">
          <button class="btn sm" id="st-open">${icon('folder-open', 15)}Ouvrir</button></div>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="st-change">${icon('folder-cog', 15)}Changer…</button>
          <button class="btn sm ghost" id="st-reset">Par défaut</button><span class="grow"></span>
          <button class="btn sm" id="st-restore">${icon('archive-restore', 15)}Restaurer le contenu d'origine</button></div>
        <div class="hint">Les articles sont de simples fichiers Markdown : synchronisez ce dossier avec Git, un NAS ou un cloud pour le partager.</div></div>
      <div class="field"><label>Mises à jour</label>
        <div class="row"><div class="grow"><b style="font-size:13px">Logiciel</b><div class="hint" style="margin:0">Version installée : ${esc(state.info.version)}. Vérifiée uniquement quand vous le demandez.</div></div>
          <button class="btn sm" id="st-check-app">${icon('app-window', 15)}Rechercher une mise à jour du logiciel</button></div>
        <div class="row" style="margin-top:10px"><div class="grow"><b style="font-size:13px">Wiki (.netwiki)</b><div class="hint" style="margin:0">Rechercher automatiquement une mise à jour du wiki à chaque démarrage (contenu publié chaque semaine). La liste des ajouts est affichée avant l'installation. <span id="st-content-ver"></span></div></div>
          <label class="toggle"><input type="checkbox" id="st-ccheck" ${s.contentCheck ? 'checked' : ''}><span></span></label></div>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="st-check-content">${icon('refresh-cw', 15)}Rechercher une mise à jour du wiki</button></div>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="st-export">${icon('package', 15)}Exporter un paquet…</button>
          <button class="btn sm" id="st-import">${icon('package-open', 15)}Importer un paquet…</button></div>
        <div class="hint">Requêtes anonymes vers github.com/JK-ASFC/netwiki, aucune donnée envoyée. Un paquet <code>.netwiki</code> contient les articles : idéal pour mettre à jour un poste sans Internet. Les paquets officiels sont signés par JK-ASFC ; vos modifications locales ne sont jamais écrasées. Après chaque mise à jour, NetWiki redémarre.</div></div>
`}
      <div class="row st-foot" style="margin-top:18px"><p style="font-size:12px;color:var(--text-faint)" class="grow">NetWiki ${esc(state.info.version)} · © 2026 JK-ASFC · licence MIT · ${state.info.mobile ? esc(state.info.platformLabel || state.info.platform) : `Electron ${esc(state.info.electron)} · ${esc(state.info.platform)}`}</p>
        <button class="btn sm ghost" id="st-support">${icon('heart', 15)}Soutenir</button>
        <button class="btn sm ghost" id="st-about">${icon('info', 15)}À propos, confidentialité, RGPD</button></div>`,
    actions: [{ label: 'Fermer', kind: 'primary', value: true }],
    onMount: (b) => {
      const seg = $('#st-theme', b);
      const placeThumb = () => {
        const on = $('button.on', seg);
        $('.thumb', seg).style.left = on.offsetLeft + 'px';
        $('.thumb', seg).style.width = on.offsetWidth + 'px';
      };
      requestAnimationFrame(placeThumb);
      $$('button', seg).forEach(
        (btn) =>
          (btn.onclick = () => {
            $$('button', seg).forEach((x) => x.classList.toggle('on', x === btn));
            placeThumb();
            actions.saveSettings({ theme: btn.dataset.themeV });
            actions.applyAppearance(true);
          })
      );
      $('#st-accent', b).onclick = (e) => {
        const sw = e.target.closest('.swatch');
        if (!sw) return;
        $$('#st-accent .swatch', b).forEach((x) => x.classList.toggle('on', x === sw));
        actions.saveSettings({ accent: sw.dataset.c });
        actions.applyAppearance(true);
      };
      $('#st-fs', b).oninput = (e) => {
        $('#st-fs-v', b).textContent = e.target.value + 'px';
        actions.saveSettings({ fontSize: Number(e.target.value) });
        actions.applyAppearance();
      };
      $('#st-wide', b).onchange = (e) => {
        actions.saveSettings({ readingWidth: e.target.checked ? 'wide' : 'normal' });
        actions.rerender();
      };
      $('#st-toc', b).onchange = (e) => {
        actions.saveSettings({ showToc: e.target.checked });
        actions.rerender();
      };
      $('#st-fx', b).onchange = (e) => {
        actions.saveSettings({ effects: e.target.checked });
        actions.applyAppearance();
      };
      $('#st-about', b).onclick = () => openAbout();
      $('#st-support', b).onclick = () => openAbout('soutenir');
      $('#st-splash', b).onchange = (e) => actions.saveSettings({ showSplash: e.target.checked });
      $('#st-check-app', b).onclick = () => actions.checkAppUpdate();
      $('#st-check-content', b).onclick = () => actions.checkContentUpdate({ manual: true });
      const on = (id, ev, fn) => {
        const el = $(id, b);
        if (el) el[ev] = fn;
      };
      on('#st-auto', 'onchange', (e) => {
        actions.saveSettings({ appCheck: e.target.checked, contentCheck: e.target.checked });
        if (e.target.checked) actions.checkAppUpdate();
      });
      on('#st-notify', 'onchange', async (e) => {
        const r = await setUpdateNotifications(e.target.checked);
        e.target.checked = !!r?.enabled;
        if (r?.denied) {
          $('#st-notify-hint', b).innerHTML = `Notifications refusées pour NetWiki. <a href="#" id="st-notify-open">Ouvrir les réglages d'Android</a>`;
          $('#st-notify-open', b).onclick = (ev) => {
            ev.preventDefault();
            api.mobile?.openNotificationSettings();
          };
        } else if (r?.enabled) toast('Notifications de mise à jour activées', 'info');
      });
      if (!$('#st-ccheck', b)) return wireCommon(b);
      $('#st-ccheck', b).onchange = (e) => {
        actions.saveSettings({ contentCheck: e.target.checked });
        if (e.target.checked) actions.checkContentUpdate({ manual: true });
      };
      $('#st-export', b).onclick = () => actions.exportPack();
      wireCommon(b);
      $('#st-open', b).onclick = () => api.openDataDir();
      $('#st-change', b).onclick = async () => {
        const dir = await api.chooseDataDir();
        if (!dir) return;
        state.info.dataDir = dir;
        $('#st-dir', b).value = dir;
        await actions.reload(true);
        toast('Dossier des données modifié');
      };
      $('#st-reset', b).onclick = async () => {
        const dir = await api.resetDataDir();
        state.info.dataDir = dir;
        $('#st-dir', b).value = dir;
        await actions.reload(true);
      };
    },
  });
}

/** Boutons présents sur toutes les plateformes : import de paquet, restauration, version du contenu. */
function wireCommon(b) {
  $('#st-import', b).onclick = () => actions.importPack();
  api.contentInfo?.().then((c) => {
    if (c?.version) $('#st-content-ver', b).textContent = `Contenu installé : version du ${contentDate(c.version)}.`;
  });
  $('#st-restore', b).onclick = async () => {
    const ok = await confirmDialog(
      "Restaurer le contenu d'origine",
      "Les articles livrés avec NetWiki qui ont été supprimés ou déplacés seront recréés. Vos modifications existantes ne sont pas écrasées."
    );
    if (!ok) return;
    const n = await api.restoreSeeds();
    await actions.reload(true);
    toast(n ? `${n} fichier(s) restauré(s)` : 'Rien à restaurer : tout est déjà présent', 'info');
  };
}
