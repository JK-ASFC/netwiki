---
title: "$upstream_last_server_name"
description: "Variable nginx $upstream_last_server_name (ngx_http_upstream_module) — contient le nom du dernier serveur amont choisi (1.25.3) ; permet de le transmettre via SNI : nginx proxy_ssl_server_name on; proxy_ssl_name $upstream_last_server_name; NOTE Cette variable est…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_last_server_name` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

contient le nom du dernier serveur amont choisi (1.25.3) ; permet de le transmettre [[12-directives/proxy-ssl-server-name-http-proxy|via SNI]] :

```nginx
proxy_ssl_server_name on;
proxy_ssl_name        $upstream_last_server_name;
```

> [!NOTE]
> Cette variable est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
