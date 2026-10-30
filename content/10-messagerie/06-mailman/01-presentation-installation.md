---
title: Présentation et installation
description: Mailman 3 — composants (Mailman Core, API REST, Postorius, HyperKitty, Mailman Web), architecture avec Postfix, base de données et serveur web, différences avec Mailman 2.1, installation par paquets Debian (mailman3-full), environnement virtuel Python ou conteneurs Docker, et premiers réglages.
tags: [mailman, mailman3, listes de diffusion, postorius, hyperkitty, django, installation]
icon: info
---

**Mailman 3** gère des **listes de diffusion** : abonnements, modération, distribution, archives consultables. Il succède à Mailman 2.1 (Python 2, fin de vie) avec une architecture séparant le moteur et les interfaces web.

## Composants

```mermaid
flowchart LR
  I["Internet / utilisateurs"] -- SMTP --> P["Postfix"]
  P -- "LMTP 8024" --> C["Mailman Core<br/>(files, règles, distribution)"]
  C -- "SMTP 25" --> P
  C <-- "API REST 8001" --> W["Mailman Web (Django)<br/>Postorius + HyperKitty"]
  C -- "archivage" --> W
  W --> DB[("PostgreSQL")]
  C --> DB
  U["Navigateur"] -- HTTPS --> N["Nginx"] --> W
```

| Composant | Rôle |
| --- | --- |
| **Mailman Core** | Moteur : reçoit en LMTP, applique modération et règles, distribue, gère les rebonds ; expose une **API REST** |
| **Postorius** | Interface web d'administration et d'abonnement (Django) |
| **HyperKitty** | Archives web avec recherche et fils de discussion (Django) |
| **Mailman Web** | Projet Django regroupant Postorius et HyperKitty |
| `mailman-hyperkitty` | Greffon de Core qui envoie les messages aux archives |

## Différences avec Mailman 2.1

| Mailman 2.1 | Mailman 3 |
| --- | --- |
| Python 2, un seul programme | Python 3, Core + interfaces séparées |
| Un mot de passe par liste et par abonné | Comptes utilisateurs uniques (Django), connexion par réseaux sociaux possible |
| Archives Pipermail statiques | HyperKitty : recherche, fils, réponses depuis le web |
| Domaines virtuels limités | Domaines multiples natifs |
| Migration | `mailman import21` (configuration et abonnés) + `hyperkitty_import` (archives) |

## Installation

### Paquets Debian / Ubuntu

```bash
sudo apt install postgresql
sudo apt install mailman3-full          # mailman3 (Core) + mailman3-web (Postorius, HyperKitty)
# debconf : base de données (dbconfig), serveur web, nom du site
sudo systemctl status mailman3 mailman3-web
```

| Fichier | Rôle |
| --- | --- |
| `/etc/mailman3/mailman.cfg` | Configuration de Core |
| `/etc/mailman3/mailman-web.py` | Paramètres Django (domaines, base, courriel, clés) |
| `/etc/mailman3/mailman-hyperkitty.cfg` | Lien Core → archives (clé d'API) |
| `/var/lib/mailman3/` | Files, données, tables Postfix générées |
| `/var/log/mailman3/` | Journaux |

### Environnement virtuel Python (méthode officielle)

```bash
sudo useradd -m -d /opt/mailman -s /bin/bash mailman
sudo -u mailman python3 -m venv /opt/mailman/venv
sudo -u mailman /opt/mailman/venv/bin/pip install mailman mailman-web mailman-hyperkitty psycopg2-binary uwsgi
# Puis : mailman.cfg, settings.py de mailman-web, unités systemd, Nginx (voir la documentation « Mailman 3 installation »)
sudo -u mailman /opt/mailman/venv/bin/mailman-web migrate
sudo -u mailman /opt/mailman/venv/bin/mailman-web collectstatic
sudo -u mailman /opt/mailman/venv/bin/mailman-web createsuperuser
```

Avantage : versions récentes indépendantes de la distribution.

### Conteneurs

Les images `maxking/mailman-core` et `maxking/mailman-web` (projet docker-mailman) avec PostgreSQL et Nginx forment une installation complète ; Postfix peut rester sur l'hôte et livrer en LMTP au conteneur Core.

### Windows et macOS

Pas de déploiement natif : utilisez un serveur Linux ou les conteneurs (Docker Desktop pour les tests).

## Premiers réglages

```text /etc/mailman3/mailman.cfg (extrait)
[mailman]
site_owner: listes-admin@exemple.fr

[database]
class: mailman.database.postgresql.PostgreSQLDatabase
url: postgresql://mailman:MotDePasse@localhost/mailman

[webservice]
hostname: 127.0.0.1
port: 8001
admin_user: restadmin
admin_pass: MotDePasseRestLong

[archiver.hyperkitty]
class: mailman_hyperkitty.Archiver
enable: yes
configuration: /etc/mailman3/mailman-hyperkitty.cfg
```

Dans l'interface d'administration Django, créez le **domaine de messagerie** (`listes.exemple.fr`) et son **site web** correspondant, puis les listes dans Postorius.

## Suite du parcours

1. [[02-configuration-listes|Intégration Postfix, listes, modération et DMARC]]
2. [[03-exploitation-depannage|Exploitation et dépannage]]
