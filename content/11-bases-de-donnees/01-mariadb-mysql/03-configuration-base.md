---
title: "Configuration : my.cnf, InnoDB, journaux"
description: Structure des fichiers d'options et sections, paramètres essentiels du serveur (écoute, connexions, jeu de caractères utf8mb4, sql_mode), dimensionnement d'InnoDB (buffer pool, redo log, durabilité), journaux binaires, journal des requêtes lentes, modification à chaud (SET GLOBAL, SET PERSIST) et vérification des valeurs effectives.
tags: [mariadb, mysql, my.cnf, innodb, buffer pool, binlog, utf8mb4, slow query log]
icon: settings-2
---

## Fichiers d'options

Les options sont lues dans plusieurs fichiers, par **sections** : `[mysqld]` / `[mariadbd]` / `[server]` (serveur), `[client]`, `[mysqldump]`, `[galera]`… Ajoutez vos réglages dans un fichier dédié plutôt que de modifier ceux du paquet :

```bash
mysqld --verbose --help | grep -A1 "Default options"     # ordre de lecture des fichiers (mariadbd pour MariaDB)
my_print_defaults mysqld                                  # options effectivement lues
```

## Configuration de référence

```mycnf /etc/mysql/mariadb.conf.d/60-local.cnf (ou /etc/my.cnf.d/local.cnf)
[mysqld]
# Réseau
bind-address            = 10.0.30.11          # 127.0.0.1 si seules des applications locales s'y connectent
port                    = 3306
skip-name-resolve                              # pas de résolution DNS des clients (droits par IP)
max_connections         = 300
max_allowed_packet      = 64M
wait_timeout            = 600

# Jeu de caractères : utf8mb4 (le « utf8 » historique ne couvre pas les émojis ni certains caractères)
character-set-server    = utf8mb4
collation-server        = utf8mb4_unicode_ci   # MySQL 8 : utf8mb4_0900_ai_ci par défaut

# Comportement SQL strict (refuse les données tronquées ou invalides)
sql_mode                = STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# InnoDB
innodb_buffer_pool_size = 8G                   # 50 à 75 % de la RAM d'un serveur dédié
innodb_log_file_size    = 2G                   # MariaDB ; MySQL ≥ 8.0.30 : innodb_redo_log_capacity = 2G
innodb_flush_log_at_trx_commit = 1             # durabilité complète (2 = plus rapide, perte possible d'1 s)
innodb_flush_method     = O_DIRECT
innodb_file_per_table   = ON

# Journaux binaires (réplication, restauration à un instant donné)
server_id               = 11
log_bin                 = /var/lib/mysql/binlog
binlog_format           = ROW
binlog_expire_logs_seconds = 604800            # 7 jours
sync_binlog             = 1

# Journaux
log_error               = /var/log/mysql/error.log
slow_query_log          = ON
slow_query_log_file     = /var/log/mysql/slow.log
long_query_time         = 1
log_queries_not_using_indexes = OFF

# Sécurité (voir l'article dédié)
local_infile            = OFF
```

```bash
sudo systemctl restart mariadb        # ou mysql / mysqld
```

## Dimensionner InnoDB

| Paramètre | Règle pratique |
| --- | --- |
| `innodb_buffer_pool_size` | Assez grand pour contenir les données « chaudes » ; 50-75 % de la RAM d'un serveur dédié, moins si d'autres services cohabitent |
| `innodb_buffer_pool_instances` | Géré automatiquement dans les versions récentes |
| Redo log (`innodb_log_file_size` / `innodb_redo_log_capacity`) | Environ une heure d'écritures en charge ; trop petit = points de contrôle fréquents |
| `innodb_io_capacity` | 200 (disques), 2000+ (SSD/NVMe) |
| `innodb_flush_log_at_trx_commit` | `1` en production (ACID) ; `2` pour des réplicas ou des données reconstituables |

```sql
-- Taux de réussite du buffer pool (proche de 100 % attendu)
SELECT ROUND(100 * (1 - (SELECT VARIABLE_VALUE FROM information_schema.GLOBAL_STATUS WHERE VARIABLE_NAME='Innodb_buffer_pool_reads')
                    / (SELECT VARIABLE_VALUE FROM information_schema.GLOBAL_STATUS WHERE VARIABLE_NAME='Innodb_buffer_pool_read_requests')), 2) AS taux_cache;
```

Sous MySQL 8, interrogez `performance_schema.global_status` à la place d'`information_schema.GLOBAL_STATUS`.

## Modifier à chaud

```sql
SHOW VARIABLES LIKE 'max_connections';
SET GLOBAL max_connections = 500;               -- immédiat, perdu au redémarrage
SET PERSIST max_connections = 500;              -- MySQL 8 : persiste dans mysqld-auto.cnf
SET GLOBAL innodb_buffer_pool_size = 12 * 1024 * 1024 * 1024;   -- redimensionnement en ligne
```

Sous MariaDB, reportez toujours la valeur dans le fichier de configuration.

## Bases et jeux de caractères

```sql
CREATE DATABASE app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SELECT schema_name, default_character_set_name, default_collation_name FROM information_schema.schemata;
SHOW TABLE STATUS FROM app;
```

Des collations différentes entre tables ou colonnes provoquent l'erreur `Illegal mix of collations` lors des jointures : uniformisez dès la création.

## Vérifier

```sql
SHOW GLOBAL STATUS LIKE 'Uptime';
SHOW ENGINE INNODB STATUS\G
SELECT @@version, @@datadir, @@log_bin, @@binlog_format, @@innodb_buffer_pool_size / 1024 / 1024 AS buffer_pool_mo;
```
