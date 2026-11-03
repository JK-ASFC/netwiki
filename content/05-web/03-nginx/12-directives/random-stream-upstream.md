---
title: "random (ngx_stream_upstream_module)"
description: "Directive nginx random (ngx_stream_upstream_module) — Indique qu'un groupe doit utiliser une méthode de répartition où la connexion est passée à un serveur choisi au hasard, en tenant compte des poids des serveurs. Le paramètre facultatif two demande à…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `random [two [method]];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.15.1 |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Indique qu'un groupe doit utiliser une méthode de répartition où la connexion est passée à un serveur choisi au hasard, en tenant compte des poids des serveurs.

Le paramètre facultatif `two` demande à nginx de choisir au hasard [deux](https://homes.cs.washington.edu/~karlin/papers/balls.pdf) serveurs, puis d'en choisir un avec la `méthode` indiquée. La méthode par défaut est `least_conn`, qui passe la connexion au serveur ayant le moins de connexions actives.

La méthode `least_time` passe la connexion au serveur ayant le plus faible temps moyen et le moins de connexions actives. Avec `least_time=connect`, c'est le temps de [[13-variables/upstream-connect-time-stream-upstream|connexion]] au serveur amont qui est utilisé. Avec `least_time=first_byte`, le temps de réception du [[13-variables/upstream-first-byte-time|premier octet]]. Avec `least_time=last_byte`, le temps de réception du [[13-variables/upstream-session-time|dernier octet]].

> [!NOTE]
> La méthode `least_time` est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
