---
title: Redis / Valkey — aide-mémoire des commandes
description: Commandes Redis et Valkey avec exemples — connexion redis-cli (auth, TLS, ACL), types et commandes de base (chaînes, hachages, listes, ensembles, ensembles triés, expiration), parcours sûr (SCAN), informations et supervision (INFO, MONITOR, SLOWLOG, LATENCY, --bigkeys, --memkeys), configuration à chaud (CONFIG GET/SET/REWRITE), persistance (SAVE, BGSAVE, AOF), réplication et Sentinel, cluster, ACL utilisateurs.
tags: [aide-mémoire, redis, valkey, redis-cli, acl, sentinel, cache]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Redis]]. **Valkey** (fork libre) accepte les mêmes commandes avec `valkey-cli`.

## Connexion

```bash
redis-cli
redis-cli -h cache.exemple.fr -p 6379 --user app --askpass
redis-cli -h cache.exemple.fr --tls --cacert /etc/ssl/certs/ac-interne.crt --user app --askpass
redis-cli -n 2                      # base 2
redis-cli --no-auth-warning -a "$MDP" PING
```

## Données

```text
SET session:abc123 "amartin" EX 3600
GET session:abc123
TTL session:abc123
EXPIRE session:abc123 600
INCR compteur:visites
HSET utilisateur:42 nom Martin ville Paris
HGETALL utilisateur:42
LPUSH file:taches "envoyer-rapport"
RPOP file:taches
SADD tags:article:7 reseau securite
SMEMBERS tags:article:7
ZADD classement 120 amartin 95 bpetit
ZREVRANGE classement 0 9 WITHSCORES
DEL session:abc123
UNLINK grosse:cle                    # suppression non bloquante
TYPE utilisateur:42
SCAN 0 MATCH session:* COUNT 100     # jamais KEYS * en production
```

## Supervision

```bash
redis-cli INFO server | head
redis-cli INFO memory | grep -E "used_memory_human|maxmemory_human|mem_fragmentation_ratio"
redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses|evicted_keys"
redis-cli INFO replication
redis-cli INFO keyspace
redis-cli --stat                     # tableau de bord continu
redis-cli --latency
redis-cli --bigkeys
redis-cli --memkeys
redis-cli SLOWLOG GET 10
redis-cli CLIENT LIST
redis-cli CLIENT KILL ADDR 10.0.30.21:51234
redis-cli MONITOR                    # toutes les commandes en direct (impact sur les performances)
redis-cli MEMORY USAGE utilisateur:42
```

## Configuration à chaud

```bash
redis-cli CONFIG GET maxmemory
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli CONFIG REWRITE             # écrire dans redis.conf
```

## Persistance

```bash
redis-cli BGSAVE
redis-cli LASTSAVE
redis-cli CONFIG SET appendonly yes
redis-cli BGREWRITEAOF
cp /var/lib/redis/dump.rdb /srv/sauvegardes/redis-$(date +%F).rdb
```

## ACL

```text
ACL SETUSER app on >MotDePasseLong2026 ~app:* &app:* +@read +@write -@dangerous
ACL SETUSER supervision on >MotDePasseSup ~* +info +ping +client|list
ACL LIST
ACL WHOAMI
ACL DELUSER ancien
ACL SAVE
```

## Réplication, Sentinel, cluster

```bash
redis-cli -h cache2 REPLICAOF cache1.exemple.fr 6379
redis-cli -h cache2 REPLICAOF NO ONE                     # promouvoir
redis-cli -p 26379 SENTINEL masters
redis-cli -p 26379 SENTINEL get-master-addr-by-name principal
redis-cli -p 26379 SENTINEL failover principal
redis-cli --cluster create 10.0.30.61:6379 10.0.30.62:6379 10.0.30.63:6379 10.0.30.64:6379 10.0.30.65:6379 10.0.30.66:6379 --cluster-replicas 1
redis-cli -c -h 10.0.30.61 CLUSTER INFO
redis-cli --cluster check 10.0.30.61:6379
```
