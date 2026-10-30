---
title: Administration, sauvegarde et dépannage
description: Sauvegarder une base SQLite en cours d'utilisation (.backup, VACUUM INTO, API de sauvegarde — jamais une simple copie), réplication continue avec Litestream, vérification d'intégrité et récupération (.recover), maintenance (VACUUM, ANALYZE, PRAGMA optimize), concurrence et verrous, et erreurs fréquentes (database is locked, malformed, readonly, disk I/O error).
tags: [sqlite, sauvegarde, litestream, integrity_check, vacuum, verrous, dépannage]
icon: archive
---

## Sauvegarder correctement

> [!WARNING]
> Copier le fichier `.db` d'une base **en cours d'utilisation** (surtout en mode WAL, avec ses fichiers `-wal` et `-shm`) peut produire une copie **incohérente**. Utilisez les mécanismes de sauvegarde de SQLite.

| Méthode | Commande | Remarque |
| --- | --- | --- |
| Commande `.backup` | `sqlite3 app.db ".backup '/srv/sauvegardes/app.db'"` | API de sauvegarde en ligne, cohérente |
| `VACUUM INTO` | `sqlite3 app.db "VACUUM INTO '/srv/sauvegardes/app-compact.db'"` | Copie cohérente **et compactée** (≥ 3.27) |
| Export SQL | `sqlite3 app.db .dump > app.sql` | Lisible, portable, plus volumineux |
| Arrêt de l'application | `cp` des fichiers `.db`, `-wal`, `-shm` | Seulement si aucune connexion n'est ouverte |
| **Litestream** | Réplication continue vers S3, Azure, SFTP, fichier | Restauration à un instant donné |

```bash /usr/local/sbin/sauvegarde-sqlite.sh
#!/bin/bash
set -euo pipefail
SRC=/var/lib/app/app.db
DEST=/srv/sauvegardes/app-$(date +%F-%H%M).db
sqlite3 "$SRC" ".backup '$DEST'"
sqlite3 "$DEST" "PRAGMA integrity_check;" | grep -qx ok
zstd -q --rm "$DEST"
find /srv/sauvegardes -name 'app-*.db.zst' -mtime +30 -delete
```

### Litestream

```yaml /etc/litestream.yml
dbs:
  - path: /var/lib/app/app.db
    replicas:
      - type: s3
        bucket: sauvegardes-sqlite
        path: app
        endpoint: https://s3.exemple.fr
        retention: 168h
```

```bash
sudo systemctl enable --now litestream
litestream restore -o /tmp/app-restauree.db -timestamp 2025-10-29T08:00:00Z s3://sauvegardes-sqlite/app
```

## Intégrité et récupération

```sql
PRAGMA quick_check;              -- rapide
PRAGMA integrity_check;          -- complet : « ok » attendu
PRAGMA foreign_key_check;        -- violations de clés étrangères
```

```bash
# Récupérer ce qui peut l'être d'une base endommagée (≥ 3.29)
sqlite3 abimee.db ".recover" | sqlite3 recuperee.db
```

## Maintenance

| Opération | Effet |
| --- | --- |
| `VACUUM` | Reconstruit la base, récupère l'espace libre (verrou exclusif, espace disque temporaire ≈ taille de la base) |
| `PRAGMA auto_vacuum = INCREMENTAL` + `PRAGMA incremental_vacuum` | Récupération progressive (à définir avant de créer les tables, ou suivi d'un `VACUUM`) |
| `ANALYZE` / `PRAGMA optimize` | Statistiques pour le planificateur (`optimize` à la fermeture des connexions longues) |
| `PRAGMA wal_checkpoint(TRUNCATE)` | Reporte le WAL dans la base et réduit le fichier `-wal` |
| `EXPLAIN QUERY PLAN SELECT …` | Vérifier l'usage des index |

L'outil `sqlite3_analyzer` détaille l'occupation de chaque table et index.

## Concurrence

- Un seul **écrivain** à la fois ; en mode **WAL**, les lecteurs ne sont pas bloqués.
- Gardez les transactions d'écriture **courtes** ; `BEGIN IMMEDIATE` pour prendre le verrou d'écriture dès le début et éviter les échecs en cours de transaction.
- Réglez `busy_timeout` dans chaque connexion de l'application.
- Le répertoire de la base doit être **inscriptible** par l'application (création des fichiers `-wal`, `-shm`, journaux temporaires).

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `database is locked` (`SQLITE_BUSY`) | Une autre connexion écrit ou garde une transaction ouverte | `busy_timeout`, mode WAL, transactions courtes, une seule file d'écriture dans l'application |
| `attempt to write a readonly database` | Droits sur le fichier **ou sur son répertoire** | Propriétaire et droits du répertoire (fichiers `-wal`/`-shm`/journal) |
| `unable to open database file` | Chemin inexistant, droits, fichier sur un volume non monté | Vérifier le chemin et les droits |
| `database disk image is malformed` | Corruption (copie à chaud, partage réseau, panne disque, coupure avec `synchronous = OFF`) | Restaurer une sauvegarde ; à défaut `.recover` |
| `disk I/O error` | Disque plein, erreur matérielle, système de fichiers réseau | Espace disque, `dmesg`, déplacer la base sur un disque local |
| `no such table` alors que la table existe | Mauvais fichier ouvert (chemin relatif, base créée vide ailleurs) | Chemin absolu, `.databases` |
| Fichier `-wal` qui grossit sans fin | Lecteur permanent empêchant les points de contrôle | Fermer les transactions de lecture longues, `wal_checkpoint(TRUNCATE)` |
