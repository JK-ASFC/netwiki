---
title: "$ssl_client_cert (ngx_http_ssl_module)"
description: "Variable nginx $ssl_client_cert (ngx_http_ssl_module) — renvoie le certificat du client au format PEM pour la connexion SSL établie, chaque ligne sauf la première étant précédée d'une tabulation ; destiné à la directive proxy_set_header ; NOTE Cette…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_client_cert` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie le certificat du client au format PEM pour la connexion SSL établie, chaque ligne sauf la première étant précédée d'une tabulation ; destiné à la directive [[12-directives/proxy-set-header|proxy_set_header]] ;

> [!NOTE]
> Cette variable est obsolète ; utiliser plutôt la variable `$ssl_client_escaped_cert`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
