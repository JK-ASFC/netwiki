---
title: "least_conn (ngx_stream_upstream_module)"
description: "Directive nginx least_conn (ngx_stream_upstream_module) — Indique qu'un groupe doit utiliser une méthode de répartition où la connexion est passée au serveur ayant le moins de connexions actives, en tenant compte des poids des serveurs. S'il y en a…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `least_conn;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Indique qu'un groupe doit utiliser une méthode de répartition où la connexion est passée au serveur ayant le moins de connexions actives, en tenant compte des poids des serveurs. S'il y en a plusieurs, ils sont essayés à tour de rôle selon une méthode round-robin pondérée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
