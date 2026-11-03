---
title: "keepalive_time (ngx_http_core_module)"
description: "Directive nginx keepalive_time (ngx_http_core_module) — Limite la durée maximale pendant laquelle des requêtes peuvent être traitées sur une connexion persistante. Une fois cette durée atteinte, la connexion est fermée après le traitement de la requête…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_time time;` |
| **Valeur par défaut** | `keepalive_time 1h;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.19.10 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Limite la durée maximale pendant laquelle des requêtes peuvent être traitées sur une connexion persistante. Une fois cette durée atteinte, la connexion est fermée après le traitement de la requête suivante.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
