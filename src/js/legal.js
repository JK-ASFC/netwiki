// NetWiki — à propos, confidentialité, RGPD et licence (textes intégrés, non modifiables depuis le wiki).
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon } from './icons.js';
import { $, $$, esc, modal } from './ui.js';
import { api, state } from './state.js';

export const OWNER = 'JK-ASFC';
export const OWNER_URL = 'https://github.com/JK-ASFC';
export const REPO_URL = 'https://github.com/JK-ASFC/netwiki';
const MAJ = '30 octobre 2026';

const apropos = (info) => `
  <div class="about-head">
    <div class="about-logo">${icon('network', 30)}</div>
    <div><h2>NetWiki ${esc(info.version)}</h2><p>Le wiki local de l'architecte réseau</p></div>
  </div>
  <p><b>Auteur et titulaire des droits :</b> ${OWNER} — <a href="${OWNER_URL}">${OWNER_URL}</a></p>
  <p><b>Code source et versions :</b> <a href="${REPO_URL}">${REPO_URL}</a></p>
  <p><b>Licence :</b> MIT — Copyright © 2026 ${OWNER}. La mention de copyright doit être conservée dans toute copie ou partie substantielle du logiciel.</p>
  <p><b>Authenticité :</b> ${
    info.attributionOk
      ? `${icon('badge-check', 14)} Copie conforme : l'attribution ${OWNER} et la licence sont intactes.`
      : `${icon('triangle-alert', 14)} <span class="warn">Copie modifiée : la mention de copyright ${OWNER} a été retirée ou altérée, ce qui est contraire à la licence MIT.</span>`
  }</p>
  <p class="hint">Les paquets de contenu officiels sont signés numériquement (Ed25519) par ${OWNER} ; NetWiki vérifie cette signature avant toute mise à jour en ligne.</p>
  <p class="hint">Composants libres utilisés : Electron, CodeMirror, marked, DOMPurify, highlight.js, Mermaid, MiniSearch, Lucide, polices Inter et JetBrains Mono — chacun sous sa propre licence libre.</p>`;

const confidentialite = `
  <p class="hint">Dernière mise à jour : ${MAJ}</p>
  <h4>Engagement</h4>
  <p>NetWiki est un logiciel <b>100 % local</b>. Il ne collecte, ne transmet et ne vend <b>aucune donnée</b> : pas de compte, pas de télémétrie, pas de statistiques d'usage, pas de publicité, pas de traceur.</p>
  <h4>Données stockées sur votre poste</h4>
  <ul>
    <li><b>Articles</b> : fichiers Markdown dans le dossier des données (Paramètres → Dossier des données), que vous pouvez consulter, déplacer ou supprimer à tout moment.</li>
    <li><b>Paramètres</b> : fichier <code>settings.json</code> dans le dossier de profil de l'application (thème, favoris, historique récent, taille de la fenêtre, choix concernant les mises à jour).</li>
  </ul>
  <p>Ces données ne quittent jamais votre poste par l'action de NetWiki. Si vous synchronisez le dossier des données (Git, NAS, cloud), c'est le service que vous choisissez qui les traite.</p>
  <h4>Connexions réseau</h4>
  <ul>
    <li><b>Aucune par défaut.</b></li>
    <li><b>Vérification des mises à jour</b>, uniquement si vous l'autorisez : une requête HTTPS anonyme vers l'API publique de GitHub (<code>api.github.com</code>), au plus une fois par jour, puis le téléchargement d'un paquet signé si vous le demandez. Comme pour toute connexion à un site web, GitHub reçoit votre adresse IP et l'identifiant du logiciel (« NetWiki/version ») ; aucun contenu de votre wiki n'est envoyé. Désactivable à tout moment dans les Paramètres.</li>
    <li><b>Liens externes</b> : ils s'ouvrent dans votre navigateur, seulement quand vous cliquez dessus.</li>
    <li><b>Images distantes</b> : bloquées par la politique de sécurité de l'application (aucune image n'est chargée depuis Internet).</li>
    <li><b>Correcteur orthographique</b> : celui du système (Windows, macOS), local ; désactivé sous Linux pour éviter tout téléchargement de dictionnaire.</li>
  </ul>
  <h4>Permissions</h4>
  <p>NetWiki refuse tout accès à la caméra, au microphone, à la position, aux notifications et aux autres permissions sensibles. Seule la copie dans le presse-papiers (boutons « Copier ») est autorisée.</p>
  <h4>Sécurité</h4>
  <p>Isolation du contenu affiché (bac à sable, isolation de contexte, politique de sécurité du contenu stricte, assainissement du HTML), accès disque limité au dossier des données, vérification de la signature des mises à jour, intégrité de l'archive de l'application contrôlée au démarrage.</p>
  <h4>Contact</h4>
  <p>Pour toute question : ouvrez une demande (« Issue ») sur <a href="${REPO_URL}/issues">${REPO_URL}/issues</a>.</p>`;

const rgpd = `
  <p class="hint">Dernière mise à jour : ${MAJ} — ce document décrit le fonctionnement du logiciel au regard du Règlement (UE) 2016/679 (RGPD) ; il ne constitue pas un avis juridique.</p>
  <h4>Qui traite quoi ?</h4>
  <ul>
    <li><b>${OWNER}</b>, éditeur de NetWiki, ne reçoit et ne traite <b>aucune donnée personnelle</b> de ses utilisateurs : le logiciel ne lui envoie rien.</li>
    <li><b>Vous</b> restez seul maître des contenus que vous saisissez dans votre wiki. Si vous y consignez des données personnelles (noms, adresses électroniques, numéros de téléphone de collègues…), vous en êtes responsable : appliquez les principes de minimisation, d'exactitude et de durée de conservation limitée, et protégez le poste et le dossier des données.</li>
  </ul>
  <h4>Vérification des mises à jour</h4>
  <ul>
    <li><b>Base légale</b> : votre <b>consentement</b> (article 6.1.a), demandé au premier lancement et retirable à tout moment dans les Paramètres, sans conséquence sur l'utilisation du wiki.</li>
    <li><b>Données concernées</b> : adresse IP et identifiant technique du logiciel, reçus par GitHub, Inc. lors de la requête, selon sa propre politique de confidentialité (GitHub est adhérent du Data Privacy Framework UE–États-Unis pour les transferts hors de l'Union).</li>
    <li><b>Conservation par l'éditeur</b> : aucune.</li>
  </ul>
  <h4>Ce que NetWiki ne fait pas</h4>
  <p>Aucun cookie de suivi, aucun profilage, aucune décision automatisée, aucune publicité, aucun partage avec des tiers, aucun compte utilisateur.</p>
  <h4>Vos droits</h4>
  <p>Vos données étant stockées uniquement sur votre poste, vous exercez directement vos droits d'accès, de rectification, d'effacement et de portabilité : les articles sont de simples fichiers Markdown, exportables (paquet <code>.netwiki</code>, PDF) et supprimables. Pour toute question : <a href="${REPO_URL}/issues">${REPO_URL}/issues</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr">www.cnil.fr</a>).</p>`;

const licence = `
  <pre class="license-text">MIT License

Copyright (c) 2026 JK-ASFC (https://github.com/JK-ASFC)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>
  <p class="hint">Traduction indicative : chacun peut utiliser, copier, modifier, distribuer et vendre le logiciel, à condition de conserver la mention « Copyright (c) 2026 JK-ASFC » et cette licence. Le logiciel est fourni sans garantie.</p>`;

/** Fenêtre « À propos » avec onglets : à propos, confidentialité, RGPD, licence. */
export function openAbout(tab = 'apropos') {
  const tabs = [
    ['apropos', 'À propos', 'info'],
    ['confidentialite', 'Confidentialité', 'shield-check'],
    ['rgpd', 'RGPD', 'scale'],
    ['licence', 'Licence', 'file-text'],
  ];
  const content = { apropos: apropos(state.info), confidentialite, rgpd, licence };
  modal({
    title: 'NetWiki — à propos et mentions légales',
    width: 720,
    body: `<div class="about-tabs">${tabs.map(([k, l, ic]) => `<button data-tab="${k}">${icon(ic, 14)}${l}</button>`).join('')}</div><div class="about-body"></div>`,
    onMount: (b) => {
      const show = (k) => {
        $$('.about-tabs button', b).forEach((x) => x.classList.toggle('on', x.dataset.tab === k));
        $('.about-body', b).innerHTML = content[k];
        $('.about-body', b).scrollTop = 0;
      };
      $('.about-tabs', b).onclick = (e) => {
        const t = e.target.closest('button');
        if (t) show(t.dataset.tab);
      };
      b.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="http"]');
        if (!a) return;
        e.preventDefault();
        api.openExternal(a.href);
      });
      show(tab);
    },
  });
}
