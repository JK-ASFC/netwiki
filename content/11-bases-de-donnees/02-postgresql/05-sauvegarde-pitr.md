---
title: Sauvegarde et restauration à un instant donné
description: Sauvegarder PostgreSQL — sauvegardes logiques (pg_dump formats custom et directory, pg_dumpall des rôles, pg_restore parallèle), sauvegardes physiques (pg_basebackup, incrémentales en 17), archivage des WAL et restauration à un instant donné (PITR), pgBackRest (stanza, complètes, différentielles, rétention, restauration), Barman, et tests de restauration.
tags: [postgresql, sauvegarde, pg_dump, pg_basebackup, wal, pitr, pgbackrest, barman]
icon: archive
---

## Méthodes

| Méthode | Type | Usage |
| --- | --- | --- |
| `pg_dump` / `pg_restore` | Logique, par base | Migration, copie d'une base, restauration sélective |
| `pg_dumpall --globals-only` | Rôles et tablespaces | À sauvegarder en plus de `pg_dump` |
| `pg_basebackup` | Physique, instance entière | Initialiser un réplica, sauvegarde simple |
| Archivage WAL + sauvegarde de base | Physique continue | **PITR** : retour à n'importe quel instant |
| **pgBackRest**, Barman, WAL-G | Outils complets | Production : complètes/différentielles, parallélisme, compression, chiffrement, rétention, dépôts distants (S3) |

## Sauvegarde logique

```bash
# Format « custom » (compressé, restauration sélective et parallèle)
sudo -u postgres pg_dump -Fc -d app -f /srv/sauvegardes/app-$(date +%F).dump
# Format « directory » en parallèle (grosses bases)
sudo -u postgres pg_dump -Fd -j 4 -d app -f /srv/sauvegardes/app-$(date +%F).d
# Rôles et privilèges globaux
sudo -u postgres pg_dumpall --globals-only > /srv/sauvegardes/globals-$(date +%F).sql

# Restauration
sudo -u postgres createdb -O app app_restauree
sudo -u postgres pg_restore -j 4 -d app_restauree /srv/sauvegardes/app-2025-10-29.dump
sudo -u postgres pg_restore -l app-2025-10-29.dump | grep commandes      # contenu de l'archive
sudo -u postgres pg_restore -d app -t commandes --data-only app-2025-10-29.dump
```

`pg_dump` produit une image **cohérente** sans bloquer les écritures (instantané MVCC).

## Sauvegarde physique

```bash
sudo -u postgres pg_basebackup -h localhost -D /srv/sauvegardes/base-$(date +%F) -Ft -z -X stream -P
# PostgreSQL 17 : incrémentale à partir d'un manifeste précédent (summarize_wal = on)
sudo -u postgres pg_basebackup -D /srv/sauvegardes/inc1 --incremental=/srv/sauvegardes/base/backup_manifest
pg_combinebackup /srv/sauvegardes/base /srv/sauvegardes/inc1 -o /srv/restauration
```

## Archivage des WAL et PITR

```mermaid
flowchart LR
  B["Sauvegarde de base<br/>(dimanche)"] --> W["WAL archivés en continu"]
  W --> T["Restauration jusqu'à<br/>mardi 14:31:59"]
```

```pgconf
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /srv/archives-wal/%f && cp %p /srv/archives-wal/%f'
archive_timeout = 300
```

### Restaurer à un instant donné (PostgreSQL ≥ 12)

```bash
sudo systemctl stop postgresql@17-main
sudo -u postgres mv /var/lib/postgresql/17/main /var/lib/postgresql/17/main.ancien
sudo -u postgres mkdir -m 700 /var/lib/postgresql/17/main
sudo -u postgres tar -xzf /srv/sauvegardes/base-2025-10-26/base.tar.gz -C /var/lib/postgresql/17/main
```

```pgconf postgresql.conf (temporairement)
restore_command = 'cp /srv/archives-wal/%f %p'
recovery_target_time = '2025-10-28 14:31:59+01'
recovery_target_action = 'promote'
```

```bash
sudo -u postgres touch /var/lib/postgresql/17/main/recovery.signal
sudo systemctl start postgresql@17-main      # rejoue les WAL jusqu'à la cible puis ouvre la base
```

## pgBackRest

```ini /etc/pgbackrest/pgbackrest.conf
[global]
repo1-path=/srv/pgbackrest
repo1-retention-full=2
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass=PhraseSecreteLongue
compress-type=zst
process-max=4
start-fast=y
log-level-console=info

[prod]
pg1-path=/var/lib/postgresql/17/main
```

```pgconf
archive_mode = on
archive_command = 'pgbackrest --stanza=prod archive-push %p'
```

```bash
sudo -u postgres pgbackrest --stanza=prod stanza-create
sudo -u postgres pgbackrest --stanza=prod check
sudo -u postgres pgbackrest --stanza=prod --type=full backup
sudo -u postgres pgbackrest --stanza=prod --type=diff backup       # différentielle (ou incr)
sudo -u postgres pgbackrest --stanza=prod info

# Restauration à un instant donné (service arrêté)
sudo -u postgres pgbackrest --stanza=prod --delta --type=time \
     --target="2025-10-28 14:31:59+01" --target-action=promote restore
```

pgBackRest sait sauvegarder **depuis un réplica**, écrire vers S3/Azure/GCS ou un serveur de sauvegarde dédié (SSH/TLS), et vérifier les sommes de contrôle des pages.

## Barman

Alternative (EDB) centrée sur un **serveur de sauvegarde** qui reçoit les WAL en flux (`streaming_archiver`) depuis plusieurs instances : `barman backup prod`, `barman recover --target-time … prod latest /chemin`.

## Bonnes pratiques

- [ ] Sauvegarde physique + WAL archivés (PITR) pour la production ; `pg_dump` en complément pour les restaurations ciblées
- [ ] Sauvegarde des globaux (`pg_dumpall --globals-only`) et de la configuration
- [ ] Copie hors site, chiffrée, et si possible immuable
- [ ] Supervision de l'archivage (`pg_stat_archiver` : `failed_count`, `last_archived_time`)
- [ ] **Test de restauration** régulier, chronométré (RTO) et vérifié
