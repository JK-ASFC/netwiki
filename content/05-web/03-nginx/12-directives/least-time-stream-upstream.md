---
title: "least_time (ngx_stream_upstream_module)"
description: "Directive nginx least_time (ngx_stream_upstream_module) — Indique qu'un groupe doit utiliser une méthode de répartition où la connexion est passée au serveur ayant le plus faible temps moyen et le moins de connexions actives, en tenant compte des poids des…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `least_time connect \| first_byte \| last_byte [inflight];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Indique qu'un groupe doit utiliser une méthode de répartition où la connexion est passée au serveur ayant le plus faible temps moyen et le moins de connexions actives, en tenant compte des poids des serveurs. S'il y en a plusieurs, ils sont essayés à tour de rôle selon une méthode round-robin pondérée.

Avec le paramètre `connect`, c'est le temps de [[13-variables/upstream-connect-time-stream-upstream|connexion]] au serveur amont qui est utilisé. Avec `first_byte`, le temps de réception du [[13-variables/upstream-first-byte-time|premier octet]] de données. Avec `last_byte`, le temps de réception du [[13-variables/upstream-session-time|dernier octet]]. Avec le paramètre `inflight` (1.11.6), les connexions incomplètes sont aussi prises en compte.

> [!NOTE]
> Avant la version 1.11.6, les connexions incomplètes étaient prises en compte par défaut.

> [!NOTE]
> Avant la version 1.31.0, cette directive n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
