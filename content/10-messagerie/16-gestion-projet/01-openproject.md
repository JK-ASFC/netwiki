---
title: OpenProject
description: OpenProject (GPL v3) — gestion de projet libre : lots de travaux, diagramme de Gantt, tableaux agiles (scrum et kanban), suivi du temps et des coûts, wiki, réunions, documents, BIM ; éditions Community et Enterprise, installation Docker tout-en-un et Docker Compose (méthode recommandée, Linux, Windows, macOS), paquets Ubuntu 22.04, Debian 12, RHEL 9 (openproject configure), Kubernetes (Helm), variables OPENPROJECT_*, reverse proxy, LDAP et SSO, sauvegarde (openproject run backup), mise à jour et dépannage.
tags: [openproject, gestion de projet, gantt, agile, scrum, docker, ruby]
icon: folder-kanban
---

**OpenProject** (GPL v3) couvre tout le cycle d'un projet : **lots de travaux** (*work packages* : tâches, jalons, bogues, exigences) avec relations et hiérarchie, **diagramme de Gantt** interactif, **tableaux agiles** (scrum, kanban, backlogs), suivi du **temps** et des **coûts**, wiki, forums, **réunions** (ordres du jour, comptes rendus), documents et intégration Nextcloud. L'édition **Community** est libre ; l'édition **Enterprise** ajoute notamment la synchronisation des groupes LDAP, le SSO SAML/OIDC avancé et le support. Alternatives : [[02-redmine|Redmine]], [[03-taiga-plane-leantime|Taiga, Plane, Leantime]].

## Installation

| Méthode | Usage |
| --- | --- |
| **Docker Compose** | Recommandée en production (Linux, et Windows/macOS via Docker Desktop) |
| Docker « tout-en-un » | Un conteneur avec PostgreSQL et memcached intégrés, pour démarrer vite |
| Paquets (Ubuntu 22.04, Debian 12, RHEL 9, SLES 15) | Installation classique ; plus de nouveaux paquets pour les nouvelles distributions (Ubuntu 24.04 non prise en charge par cette méthode) |
| Helm (Kubernetes) | Grands déploiements |

### Docker tout-en-un

```bash
sudo mkdir -p /var/lib/openproject/{pgdata,assets}
docker run -d -p 8080:80 --name openproject \
  -e OPENPROJECT_HOST__NAME=projets.corp.exemple.fr \
  -e OPENPROJECT_DEFAULT__LANGUAGE=fr \
  -e SECRET_KEY_BASE=$(openssl rand -hex 64) \
  -v /var/lib/openproject/pgdata:/var/openproject/pgdata \
  -v /var/lib/openproject/assets:/var/openproject/assets \
  openproject/openproject:17
```

Le mode HTTPS est actif par défaut : placer un reverse proxy TLS devant le port 8080 (en-têtes `X-Forwarded-Proto: https`). Pour un essai en HTTP seul, ajouter `-e OPENPROJECT_HTTPS=false` (jamais en production). Pour Docker Compose, utiliser le dépôt officiel `opf/openproject-docker-compose` (services web, worker, cron, PostgreSQL, memcached, proxy).

### Paquets (Debian 12 / Ubuntu 22.04)

```bash
sudo apt install -y apt-transport-https ca-certificates curl
sudo curl -fsSL https://packages.openproject.com/srv/deb/opf/openproject/gpg-key.gpg -o /usr/share/keyrings/openproject.gpg
sudo curl -fsSL https://packages.openproject.com/srv/opf/openproject/stable/17/installer/debian/12.list -o /etc/apt/sources.list.d/openproject.list
sudo apt update && sudo apt install -y openproject
sudo openproject configure          # assistant : PostgreSQL local ou distant, serveur web Apache, HTTPS, SMTP, memcached
```

RHEL 9 : activer EPEL et CRB, puis le dépôt `https://packages.openproject.com/srv/opf/openproject/stable/17/installer/el/9.repo` dans `/etc/yum.repos.d/openproject.repo` et `sudo dnf install openproject`. Les choix de l'assistant sont conservés dans `/etc/openproject/installer.dat` (`openproject reconfigure` pour les modifier).

## Premier démarrage

Ouvrir `https://projets.corp.exemple.fr` : compte **`admin` / `admin`**, changement de mot de passe imposé. Créer ensuite les projets, les **types** de lots de travaux, les **statuts** et les **flux de travail** (*Administration → Lots de travaux*), les rôles et les membres.

<!-- CAPTURE: Vue Gantt d'un projet OpenProject | _assets/openproject-gantt.png -->
<!-- CAPTURE: Tableau agile (kanban) des lots de travaux | _assets/openproject-tableau.png -->

| Menu (Administration) | Usage |
| --- | --- |
| Utilisateurs et autorisations | Comptes, groupes, rôles, droits par module |
| Authentification → LDAP | Connexion à l'annuaire ([[01-active-directory/01-presentation\|Active Directory]], [[02-openldap/01-presentation-installation\|OpenLDAP]]) |
| Authentification → OpenID / SAML | SSO ([[05-keycloak/01-presentation-installation\|Keycloak]], Entra ID) |
| Courriels et notifications | SMTP, courriels entrants (création de lots par courriel) |
| Lots de travaux | Types, statuts, flux, champs personnalisés |
| Stockages de fichiers | Intégration Nextcloud, OneDrive/SharePoint |

## Exploitation

```bash
sudo openproject config:set SERVER_PROTOCOL_FORCE_HTTPS="true" && sudo openproject configure
sudo openproject run backup                    # base, pièces jointes, configuration (dans /var/db/openproject/backup)
sudo openproject run console                   # console Rails
sudo openproject run bundle exec rake version
sudo openproject restart
docker exec openproject su - postgres -c 'pg_dump -d openproject -x -O' > /srv/sauvegardes/openproject-$(date +%F).sql   # version Docker tout-en-un
```

Mise à jour (paquets) : `sudo apt update && sudo apt install --only-upgrade openproject`, puis `sudo openproject configure` (migrations). Docker : changer l'étiquette de version, recréer le conteneur ; les migrations s'exécutent au démarrage. Passer par chaque version majeure intermédiaire si l'écart est grand.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Boucle de redirection ou « invalid host » | `OPENPROJECT_HOST__NAME`, en-tête `X-Forwarded-Proto` | Nom exact, en-têtes du proxy |
| Courriels absents | SMTP non configuré, worker arrêté | *Administration → Courriels*, conteneur/service worker |
| Lenteurs | memcached absent, base sous-dimensionnée | memcached, réglages PostgreSQL |
| Paquet introuvable sur Ubuntu 24.04 | Méthode non prise en charge | Docker Compose |

Commandes : [[90-aide-memoire|aide-mémoire]].
