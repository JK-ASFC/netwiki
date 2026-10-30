---
title: Installation (Linux, Windows, macOS, Docker)
description: Installer PostgreSQL depuis la distribution ou les dépôts PGDG sous Debian/Ubuntu (outils pg_lsclusters, pg_ctlcluster) et RHEL (initdb, service versionné), sous Windows (installateur, winget, service), macOS (Postgres.app, Homebrew) et Docker, emplacements des fichiers, première connexion et création d'une base applicative.
tags: [postgresql, installation, pgdg, debian, rhel, windows, macos, docker, psql]
icon: download
---

## Debian / Ubuntu

```bash
# Version de la distribution
sudo apt install postgresql

# Dernière version via le dépôt PGDG
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
sudo apt install -y postgresql-17
```

Debian gère plusieurs **instances** (*clusters*) et versions côte à côte :

| Commande | Rôle |
| --- | --- |
| `pg_lsclusters` | Instances, version, port, état, répertoires |
| `pg_ctlcluster 17 main restart` | Piloter une instance (`systemctl restart postgresql@17-main`) |
| `pg_createcluster 17 rapports --port 5433` | Créer une instance supplémentaire |
| `pg_upgradecluster 15 main` | Migrer une instance vers une version majeure plus récente |

| Élément | Emplacement Debian |
| --- | --- |
| Configuration | `/etc/postgresql/17/main/` (`postgresql.conf`, `pg_hba.conf`, `conf.d/`) |
| Données | `/var/lib/postgresql/17/main/` |
| Journaux | `/var/log/postgresql/postgresql-17-main.log` |

## RHEL / Rocky / Alma (PGDG)

```bash
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf -qy module disable postgresql
sudo dnf install -y postgresql17-server postgresql17-contrib
sudo /usr/pgsql-17/bin/postgresql-17-setup initdb
sudo systemctl enable --now postgresql-17
sudo firewall-cmd --permanent --add-service=postgresql && sudo firewall-cmd --reload
```

Sous RHEL, configuration **et** données sont dans `/var/lib/pgsql/17/data/` ; le paquet de la distribution (`postgresql-server`) utilise `/var/lib/pgsql/data/`.

## Windows

```powershell
winget install --id PostgreSQL.PostgreSQL.17 -e        # installateur EDB (serveur, pgAdmin, Stack Builder)
Get-Service postgresql*
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
```

| Élément | Emplacement |
| --- | --- |
| Données et configuration | `C:\Program Files\PostgreSQL\17\data\` |
| Service | `postgresql-x64-17` (compte `NETWORK SERVICE`) |

## macOS

| Méthode | Remarque |
| --- | --- |
| **Postgres.app** | Application autonome avec plusieurs versions, idéale pour le développement |
| Homebrew | `brew install postgresql@17 && brew services start postgresql@17` |

## Docker

```bash
docker run -d --name pg17 --restart unless-stopped \
  -e POSTGRES_PASSWORD='MotDePasse' -e POSTGRES_DB=app \
  -v pg17-data:/var/lib/postgresql/data -p 127.0.0.1:5432:5432 postgres:17
```

## Première connexion

```bash
sudo -u postgres psql                       # authentification « peer » : compte Unix postgres
```

```sql
SELECT version();
\conninfo
\l                                   -- bases
\du                                  -- rôles
```

## Base applicative

```sql
CREATE ROLE app LOGIN PASSWORD 'MotDePasseLong!';
CREATE DATABASE app OWNER app ENCODING 'UTF8' LC_COLLATE 'fr_FR.UTF-8' LC_CTYPE 'fr_FR.UTF-8' TEMPLATE template0;
\c app
CREATE SCHEMA app AUTHORIZATION app;
ALTER ROLE app SET search_path = app, public;
```

L'accès réseau de ce rôle s'autorise ensuite dans `pg_hba.conf` : voir [[03-configuration-acces]].
