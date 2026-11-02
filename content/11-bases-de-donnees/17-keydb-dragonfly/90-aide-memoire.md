---
title: KeyDB et Dragonfly — aide-mémoire des commandes
description: Commandes KeyDB et Dragonfly avec exemples — keydb-cli et redis-cli (PING, INFO, INFO replication, CONFIG GET, DBSIZE, MEMORY USAGE, SLOWLOG, CLIENT LIST, REPLICAOF, BGSAVE, SAVE), options de démarrage Dragonfly, service systemd, métriques.
tags: [aide-mémoire, keydb, dragonfly, redis-cli]
icon: terminal
---

Explications : [[01-presentation-installation|KeyDB et Dragonfly]].

```bash
keydb-cli -h 10.0.20.141 -a "$MDP" PING ; keydb-cli -a "$MDP" INFO replication ; keydb-cli -a "$MDP" CONFIG GET server-threads
redis-cli -a "$MDP" INFO memory ; redis-cli -a "$MDP" DBSIZE ; redis-cli -a "$MDP" MEMORY USAGE cle:exemple
redis-cli -a "$MDP" SLOWLOG GET 10 ; redis-cli -a "$MDP" CLIENT LIST | head ; redis-cli -a "$MDP" BGSAVE
redis-cli -a "$MDP" REPLICAOF NO ONE                     # promouvoir un réplica
dragonfly --helpfull | less ; sudo systemctl status dragonfly keydb-server
redis-cli --latency -a "$MDP" ; redis-cli --bigkeys -a "$MDP"
```
