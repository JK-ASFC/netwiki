# Sécurité de NetWiki

*Copyright (c) 2026 JK-ASFC — licence MIT.*

## Signaler une vulnérabilité

Merci de **ne pas** ouvrir d'issue publique. Utilisez le signalement privé de GitHub : *Security → Report a vulnerability* sur https://github.com/JK-ASFC/netwiki. Une réponse est apportée dans les meilleurs délais ; les correctifs sont publiés dans une nouvelle version et mentionnés dans les notes de version.

## Mesures en place (audit du 30 octobre 2026)

| Domaine | Mesure |
| --- | --- |
| Moteur d'affichage | `contextIsolation`, `sandbox`, `nodeIntegration: false`, aucun `webview` |
| Contenu | Politique de sécurité du contenu stricte (aucun script en ligne, aucune ressource distante, `object-src`, `base-uri`, `form-action`, `frame-src` interdits), HTML assaini par DOMPurify, Mermaid en mode `strict`, couleurs de dossiers validées |
| Processus principal | Appels IPC acceptés uniquement depuis la page de l'application, chemins confinés au dossier des données, écriture limitée aux `.md`, pièces jointes limitées aux images et PDF (50 Mo) |
| Navigation | Navigation interne bloquée, liens externes ouverts dans le navigateur système, nouvelles fenêtres refusées |
| Permissions | Toutes refusées sauf l'écriture dans le presse-papiers |
| Réseau | Aucune requête sans accord ; mises à jour via HTTPS depuis GitHub uniquement (hôtes contrôlés, taille limitée) |
| Mises à jour de contenu | Paquets signés Ed25519 par JK-ASFC, signature vérifiée avant import, chemins et types de fichiers filtrés, modifications locales jamais écrasées |
| Exécutable | Fusibles Electron : pas de mode « run as node », pas de `NODE_OPTIONS`, pas d'options d'inspection, chargement depuis l'archive uniquement, intégrité de l'archive vérifiée |
| Outils de développement | Désactivés dans les versions installées (activables volontairement via `"devTools": true` dans `settings.json`) |
| Dépendances | `npm audit` : 0 vulnérabilité connue au 30/10/2026 |
| Propriété | Mention de copyright JK-ASFC contrôlée au démarrage ; copie altérée signalée |

## Recommandations

- Installez les versions officielles depuis https://github.com/JK-ASFC/netwiki/releases.
- Signez les exécutables Windows (certificat de signature de code) et notarisez la version macOS pour supprimer les avertissements SmartScreen / Gatekeeper.
- Conservez la clé privée de signature des paquets hors ligne ; ne la stockez que dans les secrets GitHub Actions.
