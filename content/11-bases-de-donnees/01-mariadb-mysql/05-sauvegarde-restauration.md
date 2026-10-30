---
title: Sauvegarde et restauration
description: Stratégies de sauvegarde MariaDB et MySQL — sauvegardes logiques (mysqldump/mariadb-dump, mydumper, MySQL Shell), physiques à chaud (mariadb-backup, Percona XtraBackup, plugin clone), incrémentales, restauration à un instant donné avec les journaux binaires, instantanés de volume, compte de sauvegarde, automatisation et tests de restauration.
tags: [mariadb, mysql, sauvegarde, mysqldump, mariadb-backup, xtrabackup, pitr, binlog]
icon: archive
---

## Choisir la méthode

| Méthode | Type | Avantages | Limites |
| --- | --- | --- | --- |
| `mariadb-dump` / `mysqldump` | Logique (SQL) | Portable entre versions et produits, sélectif | Lent à restaurer sur de gros volumes |
| **mydumper / myloader** | Logique, parallèle | Beaucoup plus rapide | Outil tiers |
| MySQL Shell `util.dumpInstance()` | Logique, parallèle | Rapide, compressé (MySQL) | MySQL principalement |
| **mariadb-backup** | Physique à chaud | Rapide, incrémental, cohérent | Même version majeure à la restauration |
| **Percona XtraBackup** | Physique à chaud (MySQL) | Équivalent pour MySQL | Version de l'outil = version de MySQL (8.0, 8.4) |
| Plugin `clone` (MySQL) | Physique, réseau | Initialiser un réplica | Pas un outil de sauvegarde historisée |
| Instantané LVM/ZFS | Bloc | Quasi instantané | Cohérence à garantir (InnoDB récupère comme après un crash) |

## Compte de sauvegarde

```sql
-- MariaDB
CREATE USER 'sauvegarde'@'localhost' IDENTIFIED BY '…';
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT, RELOAD, PROCESS, LOCK TABLES, BINLOG MONITOR ON *.* TO 'sauvegarde'@'localhost';
-- MySQL (mysqldump + XtraBackup)
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT, RELOAD, PROCESS, LOCK TABLES, REPLICATION CLIENT, BACKUP_ADMIN ON *.* TO 'sauvegarde'@'localhost';
```

## Sauvegarde logique

```bash
# Toutes les bases, cohérentes (InnoDB) sans bloquer, avec position du binlog en commentaire
mariadb-dump --single-transaction --routines --triggers --events --hex-blob \
  --master-data=2 --all-databases | zstd > /srv/sauvegardes/tout-$(date +%F).sql.zst
# MySQL 8 : --source-data=2 remplace --master-data=2
mysqldump --single-transaction --routines --triggers --events --source-data=2 app | gzip > app.sql.gz

# Restauration
zstd -dc tout-2025-10-29.sql.zst | mariadb
gunzip -c app.sql.gz | mysql app
```

`--single-transaction` donne une image cohérente des tables **InnoDB** sans verrou global ; les tables MyISAM/Aria ne sont pas protégées.

```bash
# Parallèle avec mydumper
mydumper --threads 8 --compress --outputdir /srv/sauvegardes/mydumper-$(date +%F)
myloader --threads 8 --directory /srv/sauvegardes/mydumper-2025-10-29 --overwrite-tables
```

## Sauvegarde physique : mariadb-backup

```bash
# Complète
sudo mariadb-backup --backup --target-dir=/srv/sauvegardes/complete --user=sauvegarde --password='…'
# Incrémentale (depuis la complète)
sudo mariadb-backup --backup --target-dir=/srv/sauvegardes/inc1 \
     --incremental-basedir=/srv/sauvegardes/complete --user=sauvegarde --password='…'

# Restauration
sudo mariadb-backup --prepare --target-dir=/srv/sauvegardes/complete
sudo mariadb-backup --prepare --target-dir=/srv/sauvegardes/complete --incremental-dir=/srv/sauvegardes/inc1
sudo systemctl stop mariadb && sudo rm -rf /var/lib/mysql/*
sudo mariadb-backup --copy-back --target-dir=/srv/sauvegardes/complete
sudo chown -R mysql:mysql /var/lib/mysql && sudo systemctl start mariadb
```

## Sauvegarde physique : Percona XtraBackup (MySQL)

```bash
sudo xtrabackup --backup --target-dir=/srv/sauvegardes/complete --user=sauvegarde --password='…'
sudo xtrabackup --prepare --target-dir=/srv/sauvegardes/complete
# Flux compressé vers un autre serveur
sudo xtrabackup --backup --stream=xbstream --compress | ssh sauvegarde01 "cat > /srv/db1-$(date +%F).xbstream"
```

## Restauration à un instant donné (PITR)

```mermaid
flowchart LR
  F["Sauvegarde complète<br/>(dimanche 02:00)<br/>position binlog notée"] --> B["Rejeu des binlogs<br/>jusqu'à mardi 14:31:59"]
  B --> E["Juste avant l'erreur<br/>(DROP TABLE à 14:32)"]
```

```bash
# 1. Restaurer la sauvegarde complète, relever sa position (fichier xtrabackup_binlog_info / commentaire du dump)
# 2. Rejouer les binlogs depuis cette position jusqu'à l'instant voulu
mysqlbinlog --start-position=154823 --stop-datetime="2025-10-28 14:31:59" \
    /srv/binlogs/binlog.000412 /srv/binlogs/binlog.000413 | mysql      # mariadb-binlog sous MariaDB
```

Les binlogs doivent être **copiés hors du serveur** en continu (`mysqlbinlog --read-from-remote-server --raw --stop-never` vers un serveur de sauvegarde) pour survivre à la perte du serveur.

## Automatisation et contrôle

```bash /usr/local/sbin/sauvegarde-mariadb.sh
#!/bin/bash
set -euo pipefail
DEST=/srv/sauvegardes/$(date +%F)
mariadb-backup --backup --target-dir="$DEST" --user=sauvegarde --password="$(cat /root/.mdp-sauvegarde)"
mariadb-backup --prepare --target-dir="$DEST"
tar -C "$DEST" -cf - . | zstd -T0 > "$DEST.tar.zst" && rm -rf "$DEST"
find /srv/sauvegardes -name '*.tar.zst' -mtime +14 -delete
```

- [ ] Sauvegarde copiée **hors site** (et immuable si possible)
- [ ] Binlogs archivés en continu pour le PITR
- [ ] **Test de restauration** régulier sur un serveur dédié (contrôle du nombre de lignes, `CHECK TABLE`)
- [ ] Supervision : âge de la dernière sauvegarde réussie, taille
- [ ] Sauvegarde des comptes (`mysql` / `SHOW GRANTS`) et de la configuration
