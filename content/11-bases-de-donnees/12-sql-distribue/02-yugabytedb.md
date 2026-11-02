---
title: YugabyteDB
description: YugabyteDB — base SQL distribuée (Apache 2.0) réutilisant le moteur de requêtes de PostgreSQL (API YSQL, port 5433) et offrant une API compatible Cassandra (YCQL, port 9042) : architecture (YB-Master, YB-TServer, tablettes répliquées par Raft), installation (archive Linux et macOS, Docker, Kubernetes avec Helm), yugabyted pour démarrer et joindre des nœuds, facteur de réplication, chiffrement et authentification, interfaces web (15433, 7000, 9000), ysqlsh et ycqlsh, sauvegarde et différences avec PostgreSQL.
tags: [yugabytedb, sql distribué, postgresql, cassandra, raft, newsql]
icon: info
---

**YugabyteDB** offre un SQL très proche de [[02-postgresql/01-presentation|PostgreSQL]] (il en reprend le code de la couche requêtes) sur un stockage distribué inspiré de Spanner : données découpées en **tablettes** répliquées par Raft. Licence Apache 2.0 pour la base ; YugabyteDB Anywhere (gestion) est commercial.

| Port | Usage |
| --- | --- |
| **5433** | YSQL (protocole PostgreSQL) |
| 9042 | YCQL (protocole Cassandra) |
| **15433** | Interface yugabyted |
| 7000 / 9000 | Interfaces YB-Master / YB-TServer |
| 7100 / 9100 | RPC internes |

## Installation (Linux, macOS)

```bash
# Archive de la version courante depuis https://download.yugabyte.com (Linux x86_64 ou aarch64, macOS)
tar xzf yugabyte-*-linux-x86_64.tar.gz && cd yugabyte-*/ && ./bin/post_install.sh
./bin/yugabyted start --advertise_address=10.0.20.61 --base_dir=/srv/yugabyte --cloud_location=onprem.paris.zone-a
# nœuds suivants
./bin/yugabyted start --advertise_address=10.0.20.62 --join=10.0.20.61 --base_dir=/srv/yugabyte --cloud_location=onprem.paris.zone-b
./bin/yugabyted status
./bin/yugabyted configure data_placement --fault_tolerance=zone   # réplication sur 3 zones
```

Windows : pas de version native (Docker ou WSL). Docker : `yugabytedb/yugabyte`. Kubernetes : chart Helm `yugabytedb/yugabyte`. Sécurité : `--secure` (TLS et authentification) et `./bin/yugabyted cert generate_server_certs`.

```bash
./bin/ysqlsh -h 10.0.20.61 -U yugabyte
./bin/ycqlsh 10.0.20.61
```

```sql
CREATE DATABASE inventaire;
CREATE TABLE equipements (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nom TEXT, site TEXT) SPLIT INTO 6 TABLETS;
SELECT * FROM yb_servers();
```

Sauvegarde : `ysql_dump` (logique) ou instantanés distribués (`yb-admin create_database_snapshot`). Suite : [[03-tidb|TiDB]] · [[90-aide-memoire|aide-mémoire]].
