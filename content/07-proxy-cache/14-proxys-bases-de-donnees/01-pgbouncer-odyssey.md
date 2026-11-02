---
title: PgBouncer et Odyssey (PostgreSQL)
description: Regroupement de connexions PostgreSQL — pourquoi un pooler (coût d'une connexion, max_connections), PgBouncer (installation Debian/Ubuntu, RHEL, Alpine, macOS, Docker ; pgbouncer.ini, [databases], auth_type scram-sha-256, auth_file ou auth_query, pool_mode session/transaction/statement, tailles de pools, TLS, console d'administration SHOW POOLS/STATS/CLIENTS, RELOAD, PAUSE/RESUME, limites du mode transaction et requêtes préparées) et Odyssey (pooler multi-thread de Yandex, odyssey.conf, routage par base et utilisateur).
tags: [pgbouncer, odyssey, postgresql, pool de connexions, pooler]
icon: info
---

Chaque connexion [[02-postgresql/01-presentation|PostgreSQL]] est un **processus** (plusieurs Mo de mémoire) : des centaines de connexions applicatives inactives saturent `max_connections` et la RAM. Un **pooler** accepte des milliers de connexions clientes et les multiplexe sur quelques dizaines de connexions serveur.

| Mode de pool | Connexion serveur attribuée… | Compatibilité |
| --- | --- | --- |
| `session` | pour toute la session du client | Totale, gain limité |
| **`transaction`** | le temps d'une transaction | Le plus efficace ; pas d'état de session (`SET`, verrous consultatifs de session, `LISTEN`, tables temporaires hors transaction) |
| `statement` | le temps d'une requête | Interdit les transactions multi-instructions |

## PgBouncer

```bash
sudo apt install pgbouncer            # Debian/Ubuntu (ou dépôt apt.postgresql.org pour la dernière version)
sudo dnf install pgbouncer            # RHEL (dépôt PGDG)
sudo apk add pgbouncer                # Alpine
brew install pgbouncer                # macOS
```

Windows : pas de paquet officiel maintenu (conteneur ou WSL). Image conteneur : par exemple `bitnami/pgbouncer` ou `edoburu/pgbouncer`.

```ini
; /etc/pgbouncer/pgbouncer.ini
[databases]
appli = host=10.0.20.30 port=5432 dbname=appli
rapports = host=10.0.20.31 port=5432 dbname=appli pool_size=5      ; réplique en lecture

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
; ou auth_user + auth_query pour lire les mots de passe dans PostgreSQL
pool_mode = transaction
max_client_conn = 2000
default_pool_size = 20
reserve_pool_size = 5
server_idle_timeout = 300
max_prepared_statements = 200        ; requêtes préparées au niveau protocole en mode transaction (1.21+)
admin_users = pgbouncer_admin
stats_users = supervision
client_tls_sslmode = require
client_tls_cert_file = /etc/pgbouncer/tls.crt
client_tls_key_file = /etc/pgbouncer/tls.key
```

```text
# /etc/pgbouncer/userlist.txt — "utilisateur" "hachage SCRAM copié depuis pg_authid"
"appli" "SCRAM-SHA-256$4096:…"
"pgbouncer_admin" "SCRAM-SHA-256$4096:…"
```

```bash
sudo systemctl enable --now pgbouncer
psql "host=10.0.20.5 port=6432 dbname=appli user=appli"        # l'application vise désormais le port 6432
psql -h 127.0.0.1 -p 6432 -U pgbouncer_admin pgbouncer -c 'SHOW POOLS;'
```

Console d'administration (base virtuelle `pgbouncer`) : `SHOW POOLS`, `SHOW STATS`, `SHOW CLIENTS`, `SHOW SERVERS`, `SHOW CONFIG`, `RELOAD`, `PAUSE appli` / `RESUME appli` (maintenance sans couper les clients), `KILL`, `SHUTDOWN`.

## Odyssey

**Odyssey** (BSD, Yandex) est un pooler **multi-thread** (PgBouncer est mono-thread : on lance plusieurs instances avec `so_reuseport` pour dépasser un cœur). Paquets dans certaines distributions et dépôts, sinon compilation CMake ou image Docker.

```text
# /etc/odyssey/odyssey.conf (extrait)
workers 4
listen {
	host "*"
	port 6432
}
storage "pg_principal" {
	type "remote"
	host "10.0.20.30"
	port 5432
}
database "appli" {
	user "appli" {
		authentication "scram-sha-256"
		password "MdpAppli2026"
		storage "pg_principal"
		pool "transaction"
		pool_size 20
	}
}
```

Commandes : [[90-aide-memoire|aide-mémoire]].
