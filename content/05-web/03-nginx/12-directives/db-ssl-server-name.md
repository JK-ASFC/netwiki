---
title: "db_ssl_server_name"
description: "Directive nginx db_ssl_server_name (ngx_http_db_module) — Active ou désactive la transmission du nom de serveur via l'extension TLS Server Name Indication (SNI, RFC 6066) lors de l'établissement de la connexion avec le serveur de base de données."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_server_name on \| off;` |
| **Valeur par défaut** | `db_ssl_server_name off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Active ou désactive la transmission du [[12-directives/db-ssl-name|nom de serveur]] via l'[extension TLS Server Name Indication](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066) lors de l'établissement de la connexion avec le serveur de base de données.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
