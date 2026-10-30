---
title: Présentation et installation
description: Redis et son fork Valkey — structures de données en mémoire (chaînes, hachages, listes, ensembles, ensembles triés, flux), cas d'usage (cache, sessions, files, limitation de débit, pub/sub), changements de licence et choix entre Redis et Valkey, installation sous Linux, Windows (WSL, Docker, Memurai), macOS et Docker, réglages système et premiers pas avec redis-cli.
tags: [redis, valkey, cache, nosql, installation, redis-cli, licence, memurai]
icon: info
---

**Redis** est un magasin **clé-valeur en mémoire** extrêmement rapide, doté de structures de données riches. Il sert de cache, de stockage de sessions, de file de messages, de compteur, de verrou distribué ou de base principale pour des données volatiles. **Valkey** est son fork communautaire (Linux Foundation), compatible.

## Structures de données

| Type | Exemple d'usage | Commandes |
| --- | --- | --- |
| Chaîne | Cache de page, compteur | `SET`, `GET`, `INCR`, `EXPIRE` |
| Hachage | Objet (session, profil) | `HSET`, `HGETALL` |
| Liste | File d'attente simple | `LPUSH`, `BRPOP` |
| Ensemble | Étiquettes, membres uniques | `SADD`, `SISMEMBER` |
| Ensemble trié | Classement, file à priorité, fenêtre glissante | `ZADD`, `ZRANGE` |
| **Flux** (*stream*) | Journal d'événements avec groupes de consommateurs | `XADD`, `XREADGROUP` |
| Pub/Sub | Notifications en temps réel | `PUBLISH`, `SUBSCRIBE` |

## Redis ou Valkey ?

| Période | Licence |
| --- | --- |
| Redis ≤ 7.2 | BSD (libre) |
| Redis 7.4 (2024) | RSALv2 / SSPLv1 (non libres) → création de **Valkey** (BSD) |
| Redis 8 (2025) | Ajout de l'option **AGPLv3** |

Les distributions ont réagi différemment : certaines fournissent Valkey (avec des commandes `valkey-server`, `valkey-cli` et souvent des liens de compatibilité `redis-*`), d'autres Redis. Les deux parlent le **même protocole** et partagent la configuration : tout ce wiki s'applique aux deux (remplacez `redis` par `valkey` dans les noms de fichiers et de services).

## Ports

| Port | Usage |
| --- | --- |
| **6379** | Clients |
| 26379 | Sentinel |
| 16379 (port + 10000) | Bus du cluster |

## Installation

### Linux

```bash
# Debian / Ubuntu
sudo apt install redis-server            # ou : sudo apt install valkey-server (selon la distribution)
sudo systemctl enable --now redis-server
# RHEL / Rocky / Alma
sudo dnf install redis                   # ou valkey (EPEL / distribution)
sudo systemctl enable --now redis
redis-cli ping                           # PONG
```

Dépôt officiel Redis (versions récentes) : `packages.redis.io`. Fichier de configuration : `/etc/redis/redis.conf` (Debian) ou `/etc/redis/redis.conf` / `/etc/redis.conf` (RHEL).

### Windows

Pas de version native officielle :

| Option | Remarque |
| --- | --- |
| **WSL 2** | Installation Linux standard, idéale en développement |
| Docker Desktop | `docker run -p 6379:6379 redis:7` |
| **Memurai** | Implémentation compatible pour Windows (édition développeur gratuite, éditions commerciales), service Windows natif |

### macOS

```bash
brew install redis          # ou : brew install valkey
brew services start redis
```

### Docker

```bash
docker run -d --name redis --restart unless-stopped -p 127.0.0.1:6379:6379 \
  -v redis-data:/data redis:7 redis-server --appendonly yes --requirepass 'MotDePasse'
```

## Réglages système (Linux)

```bash
cat <<'EOF' | sudo tee /etc/sysctl.d/90-redis.conf
vm.overcommit_memory = 1          # indispensable pour BGSAVE (fork)
net.core.somaxconn = 1024
EOF
sudo sysctl --system
# Désactiver les Transparent Huge Pages (latences lors du fork)
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
```

Redis signale ces problèmes au démarrage dans son journal (`WARNING overcommit_memory is set to 0!`).

## Premiers pas

```bash
redis-cli
```

```text Session redis-cli
127.0.0.1:6379> SET session:4f2a "alice" EX 1800
OK
127.0.0.1:6379> GET session:4f2a
"alice"
127.0.0.1:6379> TTL session:4f2a
(integer) 1795
127.0.0.1:6379> HSET equipement:sw-core-01 site Paris modele C9300
(integer) 2
127.0.0.1:6379> HGETALL equipement:sw-core-01
127.0.0.1:6379> INFO server
```

> [!WARNING]
> Redis est conçu pour un **réseau de confiance**. Exposé sans mot de passe, il est compromis en quelques minutes (écriture de clés SSH ou de tâches cron via `CONFIG SET`). Voir [[02-configuration-persistance-securite]].

## Suite du parcours

1. [[02-configuration-persistance-securite|Configuration, persistance et sécurité]]
2. [[03-replication-sentinel-cluster|Réplication, Sentinel et Cluster]]
3. [[04-exploitation-depannage|Exploitation et dépannage]]
