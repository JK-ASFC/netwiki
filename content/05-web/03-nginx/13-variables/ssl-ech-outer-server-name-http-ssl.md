---
title: "$ssl_ech_outer_server_name (ngx_http_ssl_module)"
description: "Variable nginx $ssl_ech_outer_server_name (ngx_http_ssl_module) — renvoie le nom de serveur public demandé via SNI si ECH TLS 1.3 a été accepté, sinon « » (1.29.4) ;"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_ech_outer_server_name` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie le nom de serveur public demandé via [SNI](http://en.wikipedia.org/wiki/Server_Name_Indication) si [[12-directives/ssl-ech-file-http-ssl|ECH]] TLS 1.3 a été accepté, sinon « » (1.29.4) ;

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
