---
title: ProxySQL et MariaDB MaxScale
description: Proxys SQL pour MySQL et MariaDB — ProxySQL (GPL : installation depuis repo.proxysql.com, interface d'administration SQL port 6032, port applicatif 6033, mysql_servers, hostgroups, mysql_replication_hostgroups, mysql_users, mysql_query_rules, séparation lecture/écriture, utilisateur de supervision, LOAD TO RUNTIME / SAVE TO DISK, cache de requêtes, PostgreSQL dans ProxySQL 3) et MariaDB MaxScale (licence BSL, maxscale.cnf, moniteur mariadbmon avec bascule automatique, routeur readwritesplit, écouteurs, maxctrl, interface graphique port 8989).
tags: [proxysql, maxscale, mysql, mariadb, read write split, haute disponibilité, proxy sql]
icon: info
---

Placés entre les applications et une topologie [[01-mariadb-mysql/06-replication|primaire + répliques]], ces proxys **comprennent le SQL** : ils envoient les écritures au primaire et les lectures aux répliques, masquent les bascules et regroupent les connexions.

| | **ProxySQL** | **MaxScale** |
| --- | --- | --- |
| Licence | GPL | **BSL 1.1** (usage de production libre sous 3 serveurs de base ; chaque version devient GPL après quelques années) |
| Bases | MySQL, MariaDB, Percona ; PostgreSQL (ProxySQL 3) | MariaDB (et MySQL partiellement) |
| Configuration | Tables SQL (interface d'administration) | Fichier `maxscale.cnf` + `maxctrl` + interface web |
| Bascule | Suit la topologie (lecture seule, Galera, Group Replication) | **Pilote** la bascule (mariadbmon : *failover*, *switchover*, *rejoin*) |

## ProxySQL

```bash
# Debian/Ubuntu : dépôt repo.proxysql.com (clé et sources.list selon la documentation), puis
sudo apt install proxysql
sudo dnf install proxysql            # RHEL, avec le dépôt .repo du projet
sudo systemctl enable --now proxysql
mysql -u admin -padmin -h 127.0.0.1 -P 6032 --prompt 'ProxySQL> '    # changer ce mot de passe immédiatement
```

```sql
-- Mot de passe d'administration
UPDATE global_variables SET variable_value='admin:MdpAdminProxy2026' WHERE variable_name='admin-admin_credentials';
LOAD ADMIN VARIABLES TO RUNTIME; SAVE ADMIN VARIABLES TO DISK;

-- Serveurs : hostgroup 10 = écriture, 20 = lecture
INSERT INTO mysql_servers (hostgroup_id, hostname, port) VALUES (10, '10.0.20.31', 3306), (20, '10.0.20.32', 3306), (20, '10.0.20.33', 3306);
INSERT INTO mysql_replication_hostgroups (writer_hostgroup, reader_hostgroup, comment) VALUES (10, 20, 'replication');
UPDATE global_variables SET variable_value='supervision' WHERE variable_name='mysql-monitor_username';
UPDATE global_variables SET variable_value='MdpSupervision' WHERE variable_name='mysql-monitor_password';

-- Utilisateur applicatif (doit aussi exister sur les serveurs MySQL)
INSERT INTO mysql_users (username, password, default_hostgroup) VALUES ('appli', 'MdpAppli2026', 10);

-- Lectures vers les répliques, sauf SELECT … FOR UPDATE
INSERT INTO mysql_query_rules (rule_id, active, match_digest, destination_hostgroup, apply) VALUES
  (1, 1, '^SELECT.*FOR UPDATE', 10, 1),
  (2, 1, '^SELECT', 20, 1);

LOAD MYSQL SERVERS TO RUNTIME;    SAVE MYSQL SERVERS TO DISK;
LOAD MYSQL USERS TO RUNTIME;      SAVE MYSQL USERS TO DISK;
LOAD MYSQL QUERY RULES TO RUNTIME; SAVE MYSQL QUERY RULES TO DISK;
LOAD MYSQL VARIABLES TO RUNTIME;  SAVE MYSQL VARIABLES TO DISK;

-- Contrôle
SELECT hostgroup, srv_host, status, ConnUsed, Queries FROM stats_mysql_connection_pool;
SELECT digest_text, count_star, sum_time FROM stats_mysql_query_digest ORDER BY sum_time DESC LIMIT 10;
```

L'application se connecte au port **6033**. Les trois couches (*disk*, *memory*, *runtime*) expliquent la paire `LOAD … TO RUNTIME` / `SAVE … TO DISK` : oublier la seconde fait perdre la configuration au redémarrage.

## MariaDB MaxScale

```bash
# Dépôt MariaDB (script mariadb_repo_setup avec --mariadb-maxscale-version) puis
sudo apt install maxscale            # ou dnf install maxscale
```

```ini
# /etc/maxscale.cnf
[maxscale]
threads=auto
admin_host=0.0.0.0
admin_secure_gui=false               ; à passer à true avec un certificat (admin_ssl_cert/key)

[srv1]
type=server
address=10.0.20.31
port=3306

[srv2]
type=server
address=10.0.20.32
port=3306

[Moniteur-Repli]
type=monitor
module=mariadbmon
servers=srv1,srv2
user=maxscale_mon
password=MdpMoniteur
auto_failover=true
auto_rejoin=true
monitor_interval=2s

[Service-RW]
type=service
router=readwritesplit
servers=srv1,srv2
user=maxscale
password=MdpService

[Ecoute-RW]
type=listener
service=Service-RW
port=4006
```

```bash
sudo systemctl enable --now maxscale
maxctrl list servers
maxctrl call command mariadbmon switchover Moniteur-Repli     # bascule planifiée
```

Interface graphique **MaxScale GUI** : `http://<hôte>:8989` (compte `admin` initial à changer) — topologie, sessions, requêtes, éditeur SQL.

<!-- CAPTURE: MaxScale GUI — tableau de bord et topologie de réplication | _assets/maxscale-gui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
