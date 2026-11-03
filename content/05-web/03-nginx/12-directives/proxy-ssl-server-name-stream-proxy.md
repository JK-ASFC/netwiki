---
title: "proxy_ssl_server_name (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_server_name (ngx_stream_proxy_module) — Active ou désactive la transmission du nom de serveur via l'extension TLS Server Name Indication (SNI, RFC 6066) lors de l'établissement d'une connexion avec le serveur mandaté."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_server_name on \| off;` |
| **Valeur par défaut** | `proxy_ssl_server_name off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Active ou désactive la transmission du nom de serveur via l'[extension TLS Server Name Indication](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066) lors de l'établissement d'une connexion avec le serveur mandaté.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
