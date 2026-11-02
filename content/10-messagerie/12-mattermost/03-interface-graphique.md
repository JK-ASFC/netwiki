---
title: Interface graphique
description: Interface de Mattermost — accès web et clients de bureau, premier compte administrateur, équipes et canaux, messages, fils, réactions et recherche, invitations, System Console (utilisateurs, équipes, SMTP, authentification, greffons, journaux), intégrations (webhooks entrants et sortants, commandes slash, robots) et équivalents mmctl.
tags: [mattermost, interface web, system console, canaux, webhooks]
icon: monitor
---

Accès : `https://chat.corp.exemple.fr` dans un navigateur, ou les clients de bureau et mobiles en saisissant la même adresse.

## Espace de travail

| Zone | Contenu |
| --- | --- |
| Barre des équipes (à gauche) | Une icône par équipe ; `+` pour en créer ou en rejoindre une |
| Barre latérale | Canaux publics, privés, messages directs, catégories personnalisées, fils suivis |
| Zone centrale | Messages du canal, éditeur (Markdown, émojis, fichiers, `@mention`, `~canal`) |
| Panneau droit | Fil de discussion, résultats de recherche, épinglés, fichiers du canal |
| Menu principal (grille en haut à gauche) | Canaux, Playbooks, Boards, Marketplace, *System Console* |

<!-- CAPTURE: Espace de travail avec barre latérale, canal et fil de discussion ouvert | _assets/mattermost-espace-travail.png -->

Tâches courantes :

- **Créer un canal** : `+` dans la barre latérale → *Create new channel* (public ou privé) — CLI : `mmctl channel create --team infra --name supervision --display-name "Supervision"`.
- **Inviter** : menu de l'équipe → *Invite people* (courriel ou lien) — CLI : `mmctl team users add infra jk@corp.exemple.fr`.
- **Rechercher** : barre du haut, avec filtres `from:`, `in:`, `on:`, `before:`, `after:`.
- **Répondre dans un fil** : survoler un message → *Reply* ; *Threads* regroupe les fils suivis.

## System Console (administrateurs)

Menu principal → **System Console**.

| Section | Usage | Équivalent CLI |
| --- | --- | --- |
| User Management → Users | Rechercher, désactiver, réinitialiser un mot de passe, rôle | `mmctl user deactivate`, `mmctl user change-password` |
| User Management → Teams / Channels | Membres, confidentialité, archivage | `mmctl team`, `mmctl channel archive` |
| Environment → Web Server, Database, File Storage, SMTP | Adresse du site, base, S3, courriel | `mmctl config set …` |
| Authentication | Inscription, MFA, GitLab, OpenID, LDAP, SAML | `mmctl config set TeamSettings…` |
| Plugins → Plugin Management | Installer, activer (Calls, GitLab, Jira, Zoom…) | `mmctl plugin add`, `mmctl plugin enable` |
| Reporting → Site Statistics, Server Logs | Activité, journaux | `mmctl system status`, `journalctl -u mattermost` |
| Compliance (payant) | Rétention, export de conformité, audit | `mmctl compliance-export` |

<!-- CAPTURE: System Console, section Users | _assets/mattermost-system-console.png -->

## Intégrations

*Menu principal → Integrations* (activées dans *System Console → Integrations*) :

- **Webhook entrant** : une URL reçoit un JSON et publie dans un canal (alertes [[03-grafana/01-presentation-installation|Grafana]], Alertmanager, CI) :

```bash
curl -s -X POST -H 'Content-Type: application/json' -d '{"text": ":warning: Disque à 92 % sur srv-web-01"}' https://chat.corp.exemple.fr/hooks/xxxgenerexxx
```

- **Webhook sortant** et **commande slash** : appellent une URL de votre application quand un mot-clé ou `/commande` est saisi.
- **Compte robot** (*Bot Accounts*) : jeton d'accès pour scripts et intégrations, sans utiliser un compte personnel.

<!-- CAPTURE: Création d'un webhook entrant | _assets/mattermost-webhook.png -->
