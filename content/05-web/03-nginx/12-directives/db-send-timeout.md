---
title: "db_send_timeout"
description: "Directive nginx db_send_timeout (ngx_http_db_module) — Définit le délai d'envoi des données à un serveur de base de données."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_send_timeout time;` |
| **Valeur par défaut** | `db_send_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Définit le délai d'envoi des données à un serveur de base de données.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
