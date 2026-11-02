---
title: Proxys de bases de données — aide-mémoire des commandes
description: Commandes PgBouncer (console SHOW POOLS/STATS/CLIENTS/SERVERS/CONFIG/DATABASES, RELOAD, PAUSE, RESUME, DISABLE, KILL, SHUTDOWN, pgbouncer -R), Odyssey, ProxySQL (tables d'administration, LOAD/SAVE, statistiques, stats_mysql_connection_pool, query digest) et MaxScale (maxctrl list, show, set/clear server maintenance, switchover, failover, reload, logs) avec exemples.
tags: [aide-mémoire, pgbouncer, odyssey, proxysql, maxscale, maxctrl]
icon: terminal
---

Explications : [[01-pgbouncer-odyssey|PgBouncer et Odyssey]] · [[02-proxysql-maxscale|ProxySQL et MaxScale]].

## PgBouncer

```bash
ADM="psql -h 127.0.0.1 -p 6432 -U pgbouncer_admin pgbouncer -c"
$ADM 'SHOW POOLS;' ; $ADM 'SHOW STATS;' ; $ADM 'SHOW CLIENTS;' ; $ADM 'SHOW SERVERS;'
$ADM 'SHOW DATABASES;' ; $ADM 'SHOW CONFIG;'
$ADM 'RELOAD;'                       # relire pgbouncer.ini et userlist.txt
$ADM 'PAUSE appli;' ; $ADM 'RESUME appli;'
$ADM 'DISABLE appli;' ; $ADM 'ENABLE appli;'
sudo systemctl reload pgbouncer ; journalctl -u pgbouncer -f
```

## Odyssey

```bash
sudo systemctl restart odyssey ; journalctl -u odyssey -f
psql -h 127.0.0.1 -p 6432 -U appli -d console -c 'show pools;'    # console (si activée dans odyssey.conf)
```

## ProxySQL (port 6032)

```sql
SELECT * FROM runtime_mysql_servers;
SELECT hostgroup, srv_host, status, ConnUsed, ConnFree, Queries FROM stats_mysql_connection_pool;
SELECT * FROM monitor.mysql_server_ping_log ORDER BY time_start_us DESC LIMIT 5;
SELECT digest_text, count_star FROM stats_mysql_query_digest ORDER BY count_star DESC LIMIT 10;
UPDATE mysql_servers SET status='OFFLINE_SOFT' WHERE hostname='10.0.20.33';   -- drainer
LOAD MYSQL SERVERS TO RUNTIME; SAVE MYSQL SERVERS TO DISK;
PROXYSQL RESTART;
```

## MaxScale

```bash
maxctrl list servers ; maxctrl list services ; maxctrl list sessions
maxctrl show server srv2 ; maxctrl show monitor Moniteur-Repli
maxctrl set server srv2 maintenance ; maxctrl clear server srv2 maintenance
maxctrl call command mariadbmon switchover Moniteur-Repli srv2
maxctrl call command mariadbmon failover Moniteur-Repli
maxctrl reload service Service-RW
sudo tail -f /var/log/maxscale/maxscale.log
```
