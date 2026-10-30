---
title: Memcached — aide-mémoire des commandes
description: Commandes Memcached avec exemples — service et options (mémoire, connexions, écoute, UDP désactivé, SASL, TLS), protocole texte (stats, stats items, stats slabs, get, set, delete, flush_all), outils (memcstat, memcdump, memcflush, memccat), surveillance du taux de succès et des évictions, sécurité.
tags: [aide-mémoire, memcached, cache, stats, memcstat]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Memcached]].

## Service et options

```text
# /etc/memcached.conf (Debian)
# mémoire en Mo
-m 2048
# connexions maximales
-c 4096
# écoute locale (jamais exposé à Internet)
-l 127.0.0.1
# UDP désactivé (attaques par amplification)
-U 0
# threads
-t 4
```

```bash
sudo systemctl restart memcached
memcached -h | head
ss -ltnp | grep 11211
```

## Protocole texte (nc / telnet)

```bash
printf "stats\nquit\n" | nc 127.0.0.1 11211 | grep -E "curr_connections|get_hits|get_misses|evictions|limit_maxbytes|bytes "
printf "stats slabs\nquit\n" | nc 127.0.0.1 11211 | head
printf "stats items\nquit\n" | nc 127.0.0.1 11211 | head
printf "set test 0 300 5\r\nbonjo\r\nget test\r\nquit\r\n" | nc 127.0.0.1 11211
printf "delete test\r\nquit\r\n" | nc 127.0.0.1 11211
printf "flush_all\r\nquit\r\n" | nc 127.0.0.1 11211      # vider tout le cache
```

## Outils libmemcached

```bash
sudo apt install libmemcached-tools
memcstat --servers=127.0.0.1                 # (memcachedstat selon distribution)
memcdump --servers=127.0.0.1 | head          # clés (anciennes versions)
memccat --servers=127.0.0.1 test
memcflush --servers=127.0.0.1
```

## Indicateurs

| Indicateur | Lecture |
| --- | --- |
| Taux de succès = `get_hits / (get_hits + get_misses)` | Efficacité du cache |
| `evictions` en hausse | Mémoire insuffisante (`-m`) ou objets trop volumineux |
| `curr_connections` proche de `-c` | Augmenter les connexions ou corriger les clients |
| `listen_disabled_num` > 0 | Limite de connexions atteinte |

## Sécurité

- Écoute sur `127.0.0.1` ou un réseau privé filtré, **UDP désactivé**.
- Authentification SASL (`-S`) et TLS disponibles dans les versions récentes si le cache est partagé.
