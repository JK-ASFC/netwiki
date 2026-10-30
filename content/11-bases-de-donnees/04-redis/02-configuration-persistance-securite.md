---
title: Configuration, persistance et sécurité
description: Configurer Redis/Valkey — redis.conf (écoute, mode protégé, mémoire maximale et politiques d'éviction), persistance RDB et AOF et leurs compromis, sécurité (ACL par utilisateur, mots de passe, commandes dangereuses, TLS), intégration systemd, et réglages selon l'usage (cache pur ou stockage de données).
tags: [redis, valkey, redis.conf, rdb, aof, acl, tls, maxmemory, éviction, sécurité]
icon: shield-check
---

## Réseau et mémoire

```redis /etc/redis/redis.conf (extrait)
bind 127.0.0.1 -::1 10.0.30.51
protected-mode yes
port 6379
tcp-backlog 511
timeout 0
supervised systemd

maxmemory 4gb
maxmemory-policy allkeys-lru
maxclients 10000
```

| Politique d'éviction | Usage |
| --- | --- |
| **`noeviction`** (défaut) | Erreur `OOM` quand la mémoire est pleine : pour des **données** à ne pas perdre |
| **`allkeys-lru`** / `allkeys-lfu` | Évince les clés les moins récemment / fréquemment utilisées : **cache** |
| `volatile-lru` / `volatile-ttl` | N'évince que les clés ayant une expiration |

Réservez de la marge mémoire au-delà de `maxmemory` (copie lors des sauvegardes en arrière-plan, tampons des clients et réplicas).

## Persistance

| Mode | Principe | Perte possible | Remarques |
| --- | --- | --- | --- |
| **RDB** | Instantané périodique (`BGSAVE`, fork) | Depuis le dernier instantané | Fichier compact, redémarrage rapide |
| **AOF** | Journal de toutes les écritures | ≤ 1 s avec `appendfsync everysec` | Plus sûr, réécriture périodique |
| RDB + AOF | Les deux (recommandé pour les données) | ≤ 1 s | AOF prioritaire au redémarrage |
| Aucune | Cache pur | Tout au redémarrage | `save ""`, `appendonly no` |

```redis
# Instantanés : après 3600 s si ≥ 1 modification, 300 s si ≥ 100, 60 s si ≥ 10000
save 3600 1 300 100 60 10000
dbfilename dump.rdb
dir /var/lib/redis

appendonly yes
appendfsync everysec
aof-use-rdb-preamble yes
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

Depuis Redis 7, l'AOF est un répertoire (`appendonlydir/`) composé d'une base et de fichiers incrémentaux.

## ACL et authentification

```redis /etc/redis/users.acl (référencé par « aclfile /etc/redis/users.acl » dans redis.conf)
# Désactiver l'utilisateur par défaut (sans mot de passe)
user default off
# Administrateur
user admin on >MotDePasseAdminTresLong ~* &* +@all
# Application : uniquement ses clés, sans commandes dangereuses
user app_web on >MotDePasseApplicationLong ~session:* ~cache:* &notif:* +@read +@write +@pubsub -@dangerous
# Supervision
user supervision on >MotDePasseSupervision +ping +info +client|list +slowlog|get +latency|latest
# Réplication (sur la source)
user replication on >MotDePasseRepl +psync +replconf +ping
```

| Élément | Signification |
| --- | --- |
| `on` / `off` | Compte actif / désactivé |
| `>motdepasse` / `#sha256` | Mot de passe en clair (haché au chargement) / empreinte SHA-256 |
| `~motif` | Clés accessibles |
| `&motif` | Canaux pub/sub accessibles |
| `+@catégorie` / `-commande` | Commandes autorisées / interdites (`ACL CAT` pour la liste des catégories) |

```bash
redis-cli --user admin --askpass ACL LIST
redis-cli --user admin --askpass ACL WHOAMI
redis-cli --user admin --askpass ACL LOG          # refus récents (diagnostic)
```

Le paramètre historique `requirepass` reste valable (mot de passe de l'utilisateur `default`), mais les ACL permettent un compte par application. `rename-command` (renommer `FLUSHALL`, `CONFIG`…) est obsolète au profit des ACL.

## TLS

```redis
port 0                              # désactiver le port en clair
tls-port 6379
tls-cert-file /etc/redis/tls/redis1.crt
tls-key-file /etc/redis/tls/redis1.key
tls-ca-cert-file /etc/redis/tls/ca.crt
tls-auth-clients optional           # « yes » : certificat client exigé
tls-replication yes
tls-protocols "TLSv1.2 TLSv1.3"
```

```bash
redis-cli --tls --cacert /etc/redis/tls/ca.crt -h redis1.corp.exemple.fr --user app_web --askpass PING
```

## Durcissement

- [ ] `bind` sur l'interface utile et pare-feu (6379 accessible aux seuls serveurs d'application)
- [ ] `protected-mode yes`, utilisateur `default` désactivé, ACL par application
- [ ] TLS hors du réseau local du serveur
- [ ] Service sous l'utilisateur `redis`, droits stricts sur `/var/lib/redis` et `/etc/redis`
- [ ] `enable-debug-command no`, `enable-module-command no` (Redis ≥ 7)
- [ ] `maxmemory` défini, politique adaptée à l'usage
