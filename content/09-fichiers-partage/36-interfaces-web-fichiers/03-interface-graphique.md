---
title: Interfaces graphiques
description: Interfaces web de File Browser (navigation, envoi, partage par lien, administration des utilisateurs et des règles), Filestash (connexion aux stockages, visionneuses, console /admin) et SFTPGo (administration /web/admin : utilisateurs, groupes, dossiers, connexions actives, defender, événements ; client web /web/client), avec emplacements de captures d'écran.
tags: [file browser, filestash, sftpgo, interface graphique, captures]
icon: monitor
---

## File Browser

Navigation, envoi par glisser-déposer, aperçu et édition de fichiers texte, **Partager** (lien avec expiration et mot de passe). *Paramètres → Gestion des utilisateurs* : périmètre, permissions, règles d'exclusion.

<!-- CAPTURE: File Browser — liste des fichiers | _assets/filebrowser-liste.png -->

## Filestash

Page de connexion multi-protocoles (SFTP, S3, SMB…), explorateur avec visionneuses ; **`/admin`** : connecteurs, authentification, journaux, paramètres.

<!-- CAPTURE: Filestash — écran de connexion multi-protocoles | _assets/filestash-connexion.png -->

## SFTPGo

| Écran (`/web/admin`) | Contenu |
| --- | --- |
| **Users** | Comptes, stockage, quotas, filtres, clés |
| Groups, Folders | Réglages communs, dossiers virtuels |
| **Connections** | Sessions actives (déconnexion) |
| Defender | Adresses bloquées après échecs |
| Event Manager | Règles et actions sur événements |
| Server Manager | Configuration, sauvegarde/restauration de la configuration |

Le client web (`/web/client`) permet aux utilisateurs de déposer, télécharger et partager des fichiers.

<!-- CAPTURE: SFTPGo — liste des utilisateurs | _assets/sftpgo-utilisateurs.png -->
<!-- CAPTURE: SFTPGo — client web utilisateur | _assets/sftpgo-client.png -->
