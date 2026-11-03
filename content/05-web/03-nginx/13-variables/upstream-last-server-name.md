---
title: "$upstream_last_server_name"
description: "Variable nginx $upstream_last_server_name (ngx_http_upstream_module) — keeps the name of last selected upstream server (1.25.3); allows passing it through SNI: nginx proxy_ssl_server_name on; proxy_ssl_name $upstream_last_server_name; NOTE This variable is available as…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_last_server_name` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

keeps the name of last selected upstream server (1.25.3); allows passing it [[12-directives/proxy-ssl-server-name-http-proxy|through SNI]]:

```nginx
proxy_ssl_server_name on;
proxy_ssl_name        $upstream_last_server_name;
```

> [!NOTE]
> This variable is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
