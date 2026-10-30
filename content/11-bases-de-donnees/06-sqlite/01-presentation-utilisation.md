---
title: Présentation et utilisation
description: SQLite, base de données embarquée dans un fichier — cas d'usage et limites (un seul écrivain, partages réseau), installation de l'outil sqlite3 sous Linux, Windows et macOS, commandes du shell (.tables, .schema, .mode, .import), types et tables STRICT, PRAGMA essentiels (WAL, busy_timeout, foreign_keys), JSON et outils graphiques.
tags: [sqlite, sqlite3, base embarquée, wal, pragma, installation]
icon: info
---

**SQLite** n'est pas un serveur : c'est une **bibliothèque** qui stocke une base complète dans **un seul fichier**. Elle est intégrée à d'innombrables logiciels (navigateurs, téléphones, Mailpit, Grafana, Home Assistant, outils réseau, applications de bureau) et convient parfaitement aux applications locales, aux petits services web et aux outils d'administration.

## Quand l'utiliser ?

| Bien adapté | À éviter |
| --- | --- |
| Base locale d'une application, configuration, cache | Nombreux écrivains simultanés (un seul écrivain à la fois) |
| Service web à trafic modéré sur un seul serveur | Accès depuis plusieurs machines via un **partage réseau** (NFS, SMB) : verrous peu fiables → corruption |
| Outils, scripts, analyses de données (CSV, journaux) | Haute disponibilité native, réplication intégrée |
| Format d'échange de données | Très gros volumes multi-utilisateurs → [[02-postgresql/01-presentation\|PostgreSQL]] |

## Installation de l'outil en ligne de commande

| Système | Installation |
| --- | --- |
| Debian / Ubuntu | `sudo apt install sqlite3` |
| RHEL / Rocky / Alma | `sudo dnf install sqlite` |
| macOS | `sqlite3` intégré ; version récente : `brew install sqlite` |
| Windows | `winget install --id SQLite.SQLite -e`, ou archive *sqlite-tools* depuis sqlite.org |

## Le shell sqlite3

```bash
sqlite3 inventaire.db
```

```sql
CREATE TABLE equipements (
    id INTEGER PRIMARY KEY,
    nom TEXT NOT NULL UNIQUE,
    site TEXT NOT NULL,
    ip TEXT,
    mise_en_service TEXT DEFAULT (date('now'))
) STRICT;

INSERT INTO equipements (nom, site, ip) VALUES ('sw-core-01', 'Paris', '10.0.0.2');
SELECT site, count(*) FROM equipements GROUP BY site;
```

| Commande | Rôle |
| --- | --- |
| `.open fichier.db` | Ouvrir / créer une base |
| `.tables` / `.schema table` | Lister les tables / afficher le DDL |
| `.headers on` + `.mode box` (`column`, `csv`, `json`, `markdown`) | Format d'affichage |
| `.import --csv equipements.csv equipements` | Importer un CSV |
| `.output fichier` / `.once fichier` | Rediriger la sortie |
| `.read script.sql` | Exécuter un script |
| `.dump` | Exporter la base en SQL |
| `.timer on` | Durée des requêtes |
| `.quit` | Quitter |

```bash
# Requête ponctuelle depuis un script
sqlite3 -readonly -csv inventaire.db "SELECT nom, ip FROM equipements WHERE site='Paris';"
```

## Types et tables STRICT

SQLite utilise un typage **dynamique** (affinité) : par défaut, une colonne `INTEGER` peut recevoir du texte. Les tables **`STRICT`** (≥ 3.37) imposent les types `INTEGER`, `REAL`, `TEXT`, `BLOB`, `ANY`. Les dates se stockent en texte ISO 8601 (`'2025-10-29 09:30:00'`) ou en nombre (horodatage Unix).

## PRAGMA essentiels

```sql
PRAGMA journal_mode = WAL;       -- lectures concurrentes pendant une écriture (persistant dans le fichier)
PRAGMA synchronous = NORMAL;     -- bon compromis en mode WAL
PRAGMA foreign_keys = ON;        -- contraintes de clés étrangères (désactivées par défaut, par connexion)
PRAGMA busy_timeout = 5000;      -- attendre 5 s un verrou au lieu d'échouer immédiatement (par connexion)
PRAGMA user_version;             -- numéro de version du schéma pour les migrations applicatives
PRAGMA table_info(equipements);
```

| Mode de journal | Comportement |
| --- | --- |
| `DELETE` (défaut) | Journal d'annulation ; les lecteurs sont bloqués pendant une écriture |
| **`WAL`** | Écritures dans un fichier `-wal` ; lecteurs et écrivain en parallèle ; fichiers `-wal` et `-shm` à côté de la base |

## JSON

```sql
SELECT json_extract(donnees, '$.interfaces[0].ip') FROM equipements_json;
SELECT nom FROM equipements_json, json_each(equipements_json.donnees, '$.tags') WHERE json_each.value = 'production';
```

## Outils graphiques

| Outil | Plate-forme |
| --- | --- |
| **DB Browser for SQLite** | Windows, macOS, Linux |
| DBeaver, DataGrip | Multi-bases |
| Datasette | Publication et exploration web d'une base |

## Suite

[[02-administration-sauvegarde|Administration, sauvegarde et dépannage]]
