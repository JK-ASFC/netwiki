# Politique de confidentialité — NetWiki

*Éditeur : JK-ASFC (https://github.com/JK-ASFC) — dernière mise à jour : 30 octobre 2026.*

## Engagement

NetWiki est un logiciel **100 % local**. Il ne collecte, ne transmet et ne vend **aucune donnée** : pas de compte, pas de télémétrie, pas de statistiques d'usage, pas de publicité, pas de traceur.

## Données stockées sur votre poste

| Données | Emplacement | Contrôle |
| --- | --- | --- |
| Articles (Markdown, images jointes) | Dossier des données (*Paramètres → Dossier des données*) | Consultables, déplaçables et supprimables à tout moment |
| Paramètres (thème, favoris, historique récent, fenêtre, choix des mises à jour) | `settings.json` dans le profil de l'application (`%APPDATA%\NetWiki`, `~/Library/Application Support/NetWiki`, `~/.config/NetWiki`) | Supprimer le fichier réinitialise l'application |

Ces données ne quittent jamais votre poste par l'action de NetWiki. Si vous synchronisez le dossier des données (Git, NAS, service cloud), c'est le service choisi qui les traite.

## Connexions réseau

- **Aucune par défaut.**
- **Vérification des mises à jour**, uniquement si vous l'autorisez (question posée au premier lancement, réglable dans les Paramètres) : requête HTTPS anonyme vers l'API publique de GitHub (`api.github.com`), au plus une fois par jour ; téléchargement d'un paquet de contenu **signé** depuis `github.com` seulement si vous le demandez. GitHub reçoit, comme pour toute connexion, votre adresse IP et l'identifiant du logiciel (`NetWiki/<version>`). Aucun contenu de votre wiki n'est envoyé.
- **Liens externes** : ouverts dans votre navigateur, uniquement quand vous cliquez dessus. C'est aussi le cas du bouton « Soutenir » (page de dons Liberapay) : NetWiki n'envoie rien à Liberapay, le don se fait entièrement sur son site.
- **Images distantes** : bloquées par la politique de sécurité du contenu (aucune image chargée depuis Internet).
- **Correcteur orthographique** : celui du système (Windows, macOS), local ; désactivé sous Linux pour éviter tout téléchargement de dictionnaire.

## Permissions

Caméra, microphone, géolocalisation, notifications et autres permissions sensibles : **refusées**. Seule l'écriture dans le presse-papiers (boutons « Copier ») est autorisée.

## Sécurité

Bac à sable et isolation de contexte du moteur d'affichage, politique de sécurité du contenu stricte, assainissement du HTML, accès disque limité au dossier des données, appels internes acceptés uniquement depuis la page de l'application, vérification Ed25519 des paquets de mise à jour, intégrité de l'archive de l'application contrôlée par Electron dans les versions officielles. Voir [SECURITY.md](SECURITY.md).

## Contact

Questions et demandes : https://github.com/JK-ASFC/netwiki/issues
