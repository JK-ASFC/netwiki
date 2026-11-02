---
title: Interface graphique
description: Interface de Rocket.Chat — espace de travail (barre latérale, salons, discussions, fils, messages directs), création de canaux et d'équipes, invitations, Administration (Workspace, utilisateurs, salons, rôles et permissions, paramètres Accounts, LDAP, SAML, OAuth, File Upload), Omnichannel (départements, agents, widget de chat) et Marketplace.
tags: [rocket.chat, interface web, administration, omnichannel]
icon: monitor
---

Accès : `https://chat.corp.exemple.fr` (navigateur, client de bureau ou mobile).

## Espace de travail

| Zone | Contenu |
| --- | --- |
| Barre latérale | Accueil, recherche, salons favoris, canaux, équipes, discussions, messages directs |
| Bouton « Créer » (crayon) | Message direct, discussion, canal, équipe |
| Zone centrale | Messages, éditeur Markdown, fichiers, émojis, appels |
| En-tête du salon | Membres, fils, discussions, fichiers, épinglés, appel vidéo, paramètres du salon |
| Avatar → Administration | Paramètres du serveur (administrateurs) |

<!-- CAPTURE: Espace de travail Rocket.Chat avec un canal et ses fils | _assets/rocketchat-espace-travail.png -->

- **Équipe** : regroupe des canaux et des membres (équivalent d'un service) ; **discussion** : sous-salon temporaire rattaché à un message ou un canal.
- **Inviter** : menu du salon → *Members* → *Add* ; lien d'invitation dans *Members → Invite link*.

## Administration

Avatar → **Administration** (ou `/admin`).

| Menu | Usage |
| --- | --- |
| Workspace | Version, statistiques, enregistrement cloud, abonnement |
| Users | Créer, désactiver, réinitialiser la 2FA, attribuer des rôles |
| Rooms | Rechercher un salon, propriétaire, archivage, suppression |
| Permissions | Rôles (`admin`, `moderator`, `owner`, `user`…) et droits fins |
| Settings → Accounts | Inscription, 2FA, durée de session, mots de passe |
| Settings → LDAP / SAML / OAuth | Authentification d'entreprise et synchronisation des groupes |
| Settings → File Upload | Stockage (GridFS, FileSystem, S3), taille maximale, types autorisés |
| Settings → Email | SMTP, modèles de messages |
| Engagement / Moderation | Signalements, statistiques d'usage |
| Marketplace | Applications (Jira, GitHub, Zapier, ponts WhatsApp…) |

<!-- CAPTURE: Administration, page Users | _assets/rocketchat-administration-users.png -->

Équivalents API : `POST /api/v1/users.create`, `POST /api/v1/users.setActiveStatus`, `GET /api/v1/rooms.get`, `POST /api/v1/settings/<id>` (avec jeton administrateur).

## Omnichannel (support client)

*Administration → Omnichannel* (ou menu Omnichannel) : activer le service, créer des **départements** et des **agents**, définir le routage (manuel, *auto selection*, *load balancing*), puis copier le **script du widget Livechat** dans le site web (*Livechat Installation*). Les conversations arrivent dans la file *Queue* des agents.

<!-- CAPTURE: Configuration Omnichannel, départements et agents | _assets/rocketchat-omnichannel.png -->
