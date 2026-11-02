---
title: Présentation, installation et configuration
description: KeyDB et Dragonfly — serveurs compatibles avec le protocole Redis : KeyDB (fork multithread de Redis par Snap, licence BSD, server-threads, réplication active-active et multi-maître, FLASH, état du projet) et Dragonfly (réécriture multicœur, licence BSL 1.1, mémoire réduite, snapshots, mode cache, compatibilité, réplication) ; installation Linux, Docker, macOS, Windows via conteneur, configuration, sécurité, supervision et choix face à Redis et Valkey.
tags: [keydb, dragonfly, redis, valkey, cache, clé-valeur, compatibilité redis]
icon: info
---

Ces deux serveurs se substituent à [[04-redis/01-presentation-installation|Redis ou Valkey]] sans changer les clients (`redis-cli`, bibliothèques) : on les choisit pour exploiter **plusieurs cœurs** sur une seule instance ou pour des fonctions de réplication particulières.

| | **KeyDB** | **Dragonfly** | Valkey (rappel) |
| --- | --- | --- | --- |
| Licence | BSD-3 | **BSL 1.1** (pas de revente en service géré) | BSD-3 |
| Multithread | Oui (threads d'E/S et de traitement) | Oui, architecture « shared-nothing » par cœur | E/S multithread |
| Particularités | Réplication **active** et **multi-maître** | Faible empreinte mémoire, snapshots sans fork | Fork communautaire de référence |
| Activité | Faible depuis 2023 | Active | Active |

## KeyDB

```bash
# Debian/Ubuntu : dépôt PPA du projet (download.keydb.dev) puis
sudo apt install keydb
docker run -d --name keydb -p 6379:6379 eqalpha/keydb
```

```ini
# /etc/keydb/keydb.conf — extraits
bind 10.0.20.141 127.0.0.1
requirepass MdpCache2026
server-threads 4
# Réplication active (les deux nœuds acceptent les écritures)
active-replica yes
replicaof 10.0.20.142 6379
masterauth MdpCache2026
```

```bash
keydb-cli -a "$MDP" info replication
```

## Dragonfly

```bash
docker run -d --name dragonfly --ulimit memlock=-1 -p 6379:6379 docker.dragonflydb.io/dragonflydb/dragonfly \
  --requirepass MdpCache2026 --maxmemory 8gb --proactor_threads 8 --cache_mode=true --dir /data --dbfilename dump
# Linux sans Docker : binaire ou paquet .deb/.rpm depuis les versions GitHub ; service systemd fourni avec le paquet
```

| Option | Rôle |
| --- | --- |
| `--maxmemory` | Limite mémoire |
| `--cache_mode=true` | Éviction des clés les moins utiles quand la limite est atteinte (usage cache) |
| `--proactor_threads` | Nombre de threads (par défaut : tous les cœurs) |
| `--dir`, `--dbfilename`, `--snapshot_cron` | Instantanés sur disque |
| `--admin_port` | Port d'administration séparé (métriques `/metrics`) |

```bash
redis-cli -a "$MDP" info server | grep dragonfly_version
redis-cli -a "$MDP" REPLICAOF 10.0.20.151 6379      # réplica
curl -s http://localhost:6379/metrics | head        # métriques Prometheus (port HTTP partagé ou --admin_port)
```

> [!NOTE]
> Vérifiez la compatibilité des commandes et modules utilisés (scripts Lua, modules RedisJSON/Search, clustering) : KeyDB et Dragonfly n'implémentent pas tout à l'identique. Testez avec la charge réelle avant de basculer.

Commandes : [[90-aide-memoire|aide-mémoire]].
