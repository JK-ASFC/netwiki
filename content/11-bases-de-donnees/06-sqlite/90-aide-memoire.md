---
title: SQLite — aide-mémoire des commandes
description: Commandes SQLite avec exemples — interpréteur sqlite3 et commandes point (.tables, .schema, .mode, .headers, .import, .output, .dump, .backup, .recover), PRAGMA utiles (journal WAL, intégrité, clés étrangères, taille), requêtes, index et EXPLAIN QUERY PLAN, sauvegarde à chaud, VACUUM, outils graphiques (DB Browser for SQLite).
tags: [aide-mémoire, sqlite, sqlite3, pragma, sauvegarde, sql]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-utilisation|SQLite]].

## Interpréteur

```bash
sqlite3 app.db
sqlite3 app.db "SELECT count(*) FROM utilisateurs;"
sqlite3 -header -column app.db "SELECT * FROM utilisateurs LIMIT 5;"
sqlite3 -json app.db "SELECT id, nom FROM utilisateurs LIMIT 3;"
sqlite3 app.db < script.sql
```

| Commande | Effet |
| --- | --- |
| `.tables` / `.schema utilisateurs` | Tables / structure |
| `.headers on` + `.mode column` (ou `box`, `markdown`, `csv`, `json`) | Présentation |
| `.import --csv clients.csv clients` | Importer un CSV |
| `.output export.csv` puis requête, puis `.output stdout` | Écrire le résultat dans un fichier |
| `.dump` | Exporter toute la base en SQL |
| `.backup sauvegarde.db` / `.restore sauvegarde.db` | Sauvegarde en ligne / restauration |
| `.recover` | Récupérer le contenu d'une base corrompue |
| `.timer on` | Durée des requêtes |
| `.quit` | Quitter |

## PRAGMA utiles

```sql
PRAGMA journal_mode = WAL;            -- lectures concurrentes pendant les écritures
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;             -- à activer à chaque connexion
PRAGMA busy_timeout = 5000;
PRAGMA integrity_check;
PRAGMA quick_check;
PRAGMA page_count;
PRAGMA page_size;
PRAGMA table_info(utilisateurs);
PRAGMA index_list(utilisateurs);
PRAGMA wal_checkpoint(TRUNCATE);
```

## Requêtes, index, plan

```sql
CREATE TABLE utilisateurs (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, email TEXT UNIQUE, cree_le TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_utilisateurs_nom ON utilisateurs(nom);
EXPLAIN QUERY PLAN SELECT * FROM utilisateurs WHERE nom = 'Martin';
INSERT INTO utilisateurs (nom, email) VALUES ('Martin', 'alice.martin@exemple.fr') ON CONFLICT(email) DO NOTHING;
ANALYZE;
VACUUM;                               -- compacter (réécrit la base)
VACUUM INTO 'copie-compacte.db';      -- copie compacte, utilisable comme sauvegarde
```

## Sauvegarde à chaud

```bash
sqlite3 app.db ".backup '/srv/sauvegardes/app-$(date +%F).db'"
sqlite3 app.db ".dump" | gzip > /srv/sauvegardes/app-$(date +%F).sql.gz
```

Ne copiez pas un fichier SQLite en cours d'écriture avec `cp` (et pensez aux fichiers `-wal` et `-shm`) : utilisez `.backup` ou `VACUUM INTO`.

## Outils graphiques

**DB Browser for SQLite** (Windows, macOS, Linux), DBeaver, extensions des éditeurs de code.
