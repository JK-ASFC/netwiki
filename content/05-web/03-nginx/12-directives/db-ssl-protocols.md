---
title: "db_ssl_protocols"
description: "Directive nginx db_ssl_protocols (ngx_http_db_module) — Active les protocoles indiqués pour les connexions aux serveurs de base de données."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_protocols [SSLv2] [SSLv3] [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `db_ssl_protocols TLSv1.2 TLSv1.3;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Active les protocoles indiqués pour les connexions aux serveurs de base de données.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
