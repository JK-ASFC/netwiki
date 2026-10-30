---
title: MariaDB / MySQL — aide-mémoire des commandes
description: Commandes MariaDB et MySQL avec exemples — connexion (mysql/mariadb, ~/.my.cnf), sécurisation initiale, bases et utilisateurs (CREATE USER, GRANT, SHOW GRANTS, rôles), sauvegarde et restauration (mysqldump, mariadb-dump, mariabackup, mysqlpump), état et performances (SHOW PROCESSLIST, STATUS, VARIABLES, EXPLAIN, journal lent, mysqladmin), réplication (CHANGE MASTER, SHOW REPLICA STATUS), maintenance (CHECK, OPTIMIZE, mysqlcheck), mise à niveau.
tags: [aide-mémoire, mariadb, mysql, mysqldump, mariabackup, sql, réplication]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|MariaDB / MySQL]]. Sous MariaDB récent, les commandes s'appellent aussi `mariadb`, `mariadb-dump`, `mariadb-admin`.

## Connexion et sécurisation

```bash
sudo mariadb                                   # root par socket Unix
mysql -h db.exemple.fr -u app -p appdb
mysql -h db.exemple.fr -u app -p --ssl-mode=REQUIRED appdb       # MySQL ; MariaDB : --ssl
sudo mariadb-secure-installation               # mysql_secure_installation
mysql -e "SELECT VERSION();"
```

```ini
# ~/.my.cnf (droits 600)
[client]
user=admin
password=MotDePasse
host=db.exemple.fr
```

## Bases, utilisateurs, droits

```sql
CREATE DATABASE appdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app'@'10.0.30.%' IDENTIFIED BY 'MotDePasseLong2026';
GRANT SELECT, INSERT, UPDATE, DELETE ON appdb.* TO 'app'@'10.0.30.%';
GRANT ALL PRIVILEGES ON appdb.* TO 'admin_app'@'localhost';
CREATE USER 'sauvegarde'@'localhost' IDENTIFIED BY 'MotDePasseSauvegarde';
GRANT SELECT, SHOW VIEW, TRIGGER, LOCK TABLES, EVENT, RELOAD, PROCESS ON *.* TO 'sauvegarde'@'localhost';
SHOW GRANTS FOR 'app'@'10.0.30.%';
ALTER USER 'app'@'10.0.30.%' IDENTIFIED BY 'NouveauMotDePasse2026';
ALTER USER 'app'@'10.0.30.%' REQUIRE SSL;
REVOKE DELETE ON appdb.* FROM 'app'@'10.0.30.%';
DROP USER 'ancien'@'%';
SELECT user, host, plugin FROM mysql.user;
SHOW DATABASES;
SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS taille_mo FROM information_schema.tables GROUP BY table_schema;
```

## Sauvegarde et restauration

```bash
mysqldump --single-transaction --routines --triggers --events appdb | gzip > appdb-$(date +%F).sql.gz
mysqldump --single-transaction --all-databases --routines --events | zstd > tout-$(date +%F).sql.zst
gunzip < appdb-2026-10-29.sql.gz | mysql appdb
mysqldump --no-data appdb > schema.sql
# Sauvegarde physique à chaud (MariaDB)
sudo mariabackup --backup --target-dir=/srv/sauvegardes/mariabackup/$(date +%F) --user=sauvegarde --password="$MDP"
sudo mariabackup --prepare --target-dir=/srv/sauvegardes/mariabackup/2026-10-29
# Restauration physique (service arrêté, datadir vide)
sudo mariabackup --copy-back --target-dir=/srv/sauvegardes/mariabackup/2026-10-29 && sudo chown -R mysql:mysql /var/lib/mysql
```

## État et performances

```sql
SHOW FULL PROCESSLIST;
KILL 1234;
SHOW GLOBAL STATUS LIKE 'Threads_connected';
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 1;
EXPLAIN SELECT * FROM commandes WHERE client_id = 42;
SHOW ENGINE INNODB STATUS\G
SHOW INDEX FROM commandes;
ANALYZE TABLE commandes;
```

```bash
mysqladmin -u root -p status extended-status processlist
mysqladmin -u root -p flush-logs
mysqldumpslow -s t /var/log/mysql/slow.log | head -20       # MariaDB : mariadb-dumpslow
mysqlcheck --all-databases --check --auto-repair
mysqlcheck --optimize appdb
```

## Réplication

```sql
-- Sur le primaire
CREATE USER 'repl'@'10.0.30.%' IDENTIFIED BY 'MotDePasseRepl';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'10.0.30.%';
SHOW MASTER STATUS;                      -- MySQL 8.4 : SHOW BINARY LOG STATUS
-- Sur le réplica (MariaDB, GTID)
CHANGE MASTER TO MASTER_HOST='10.0.30.51', MASTER_USER='repl', MASTER_PASSWORD='MotDePasseRepl', MASTER_USE_GTID=slave_pos;
START SLAVE;
SHOW SLAVE STATUS\G
-- MySQL 8 : CHANGE REPLICATION SOURCE TO SOURCE_HOST=…, SOURCE_AUTO_POSITION=1; START REPLICA; SHOW REPLICA STATUS\G
```

## Mise à niveau

```bash
sudo mariadb-upgrade             # après mise à jour majeure de MariaDB (MySQL 8 : automatique au démarrage)
sudo journalctl -u mariadb -f
```
