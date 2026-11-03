---
title: "limit_req_status"
description: "Directive nginx limit_req_status (ngx_http_limit_req_module) — Définit le code de statut renvoyé pour les requêtes rejetées."
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req_status code;` |
| **Valeur par défaut** | `limit_req_status 503;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.15 |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Définit le code de statut renvoyé pour les requêtes rejetées.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
