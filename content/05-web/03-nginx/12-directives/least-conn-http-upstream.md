---
title: "least_conn (ngx_http_upstream_module)"
description: "Directive nginx least_conn (ngx_http_upstream_module) — Indique que le groupe utilise une méthode de répartition qui transmet la requête au serveur ayant le moins de connexions actives, en tenant compte des poids. Si plusieurs serveurs sont à égalité, ils…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `least_conn;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.3.1, 1.2.2 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Indique que le groupe utilise une méthode de répartition qui transmet la requête au serveur ayant le moins de connexions actives, en tenant compte des poids. Si plusieurs serveurs sont à égalité, ils sont essayés à tour de rôle selon le tourniquet pondéré.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
