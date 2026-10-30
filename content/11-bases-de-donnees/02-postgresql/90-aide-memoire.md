---
title: PostgreSQL — aide-mémoire des commandes
description: Commandes PostgreSQL avec exemples — connexion (psql, .pgpass, chaînes de connexion), méta-commandes psql (\l, \dt, \du, \x, \timing), rôles et droits (CREATE ROLE, GRANT, privilèges par défaut), pg_hba.conf, sauvegarde et restauration (pg_dump, pg_dumpall, pg_restore, pg_basebackup), maintenance (VACUUM, ANALYZE, REINDEX), supervision (pg_stat_activity, verrous, tailles, pg_stat_statements), réplication et bascule, mise à niveau (pg_upgrade), clusters Debian (pg_lsclusters).
tags: [aide-mémoire, postgresql, psql, pg_dump, pg_basebackup, vacuum, réplication]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|PostgreSQL]].

## Connexion

```bash
sudo -u postgres psql
psql -h db.exemple.fr -U app -d appdb
psql "postgresql://app@db.exemple.fr:5432/appdb?sslmode=verify-full"
psql -h db.exemple.fr -U app -d appdb -c "SELECT now();"
psql -f script.sql appdb
echo "db.exemple.fr:5432:appdb:app:MotDePasse" >> ~/.pgpass && chmod 600 ~/.pgpass
pg_lsclusters                         # Debian : clusters et versions
pg_isready -h db.exemple.fr
```

## Méta-commandes psql

| Commande | Effet |
| --- | --- |
| `\l` / `\c appdb` | Bases / se connecter à une base |
| `\dt`, `\dt+`, `\d commandes` | Tables, tailles, structure d'une table |
| `\di`, `\dv`, `\df`, `\dn` | Index, vues, fonctions, schémas |
| `\du` | Rôles |
| `\dp commandes` | Droits sur un objet |
| `\x auto` / `\timing on` | Affichage étendu / durée des requêtes |
| `\conninfo` | Connexion courante |
| `\copy commandes TO 'commandes.csv' CSV HEADER` | Export CSV côté client |
| `\i script.sql` / `\e` | Exécuter un fichier / éditer la requête |
| `\q` | Quitter |

## Rôles et droits

```sql
CREATE ROLE app LOGIN PASSWORD 'MotDePasseLong2026';
CREATE DATABASE appdb OWNER app;
CREATE ROLE lecture NOLOGIN;
GRANT CONNECT ON DATABASE appdb TO lecture;
GRANT USAGE ON SCHEMA public TO lecture;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO lecture;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO lecture;
CREATE ROLE amartin LOGIN PASSWORD 'MotDePasse' IN ROLE lecture;
ALTER ROLE amartin VALID UNTIL '2027-01-01';
REVOKE ALL ON DATABASE appdb FROM PUBLIC;
\password app
```

```text
# pg_hba.conf : type  base   utilisateur  adresse          méthode
hostssl  appdb  app          10.0.30.0/24     scram-sha-256
hostssl  all    +lecture     10.0.99.0/24     scram-sha-256
host     all    all          0.0.0.0/0        reject
```

```sql
SELECT pg_reload_conf();           -- appliquer pg_hba.conf et les paramètres rechargeables
SHOW hba_file;
SELECT * FROM pg_hba_file_rules WHERE error IS NOT NULL;
```

## Sauvegarde et restauration

```bash
pg_dump -Fc -h db.exemple.fr -U app appdb > appdb-$(date +%F).dump
pg_dump -Fd -j 4 -f /srv/sauvegardes/appdb appdb               # format répertoire, parallèle
pg_dumpall --globals-only > roles.sql                          # rôles et tablespaces
pg_restore -l appdb.dump | head                                 # contenu
pg_restore -d appdb_test --clean --if-exists -j 4 appdb.dump
pg_restore -d appdb -t commandes appdb.dump                     # une seule table
pg_basebackup -h db1.exemple.fr -U repl -D /srv/sauvegardes/base-$(date +%F) -Ft -z -P -X stream
```

## Maintenance

```sql
VACUUM (VERBOSE, ANALYZE) commandes;
ANALYZE;
REINDEX TABLE CONCURRENTLY commandes;
SELECT relname, n_dead_tup, last_autovacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;
```

## Supervision

```sql
SELECT pid, usename, client_addr, state, now() - query_start AS duree, left(query, 80) FROM pg_stat_activity WHERE state <> 'idle' ORDER BY duree DESC;
SELECT pg_cancel_backend(1234);       -- annuler la requête
SELECT pg_terminate_backend(1234);    -- couper la connexion
SELECT pg_size_pretty(pg_database_size('appdb'));
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 10;
SELECT * FROM pg_locks l JOIN pg_stat_activity a USING (pid) WHERE NOT l.granted;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT calls, round(mean_exec_time::numeric, 1) AS ms, left(query, 80) FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM commandes WHERE client_id = 42;
```

## Réplication

```sql
SELECT client_addr, state, sent_lsn, replay_lsn, replay_lag FROM pg_stat_replication;     -- sur le primaire
SELECT pg_is_in_recovery(), now() - pg_last_xact_replay_timestamp() AS retard;          -- sur le réplica
SELECT * FROM pg_replication_slots;
SELECT pg_promote();                                                                     -- promouvoir le réplica
```

## Mise à niveau majeure

```bash
# Debian (pg_upgradecluster)
sudo pg_upgradecluster 15 main
# Générique
sudo -u postgres pg_upgrade -b /usr/lib/postgresql/15/bin -B /usr/lib/postgresql/17/bin -d /var/lib/postgresql/15/main -D /var/lib/postgresql/17/main --check
```
