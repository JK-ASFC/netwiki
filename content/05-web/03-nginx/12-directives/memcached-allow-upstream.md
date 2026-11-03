---
title: "memcached_allow_upstream"
description: "Directive nginx memcached_allow_upstream (ngx_http_memcached_module) — Defines conditions under which access to a memcached server is allowed or denied. If all string parameters are not empty and not equal to “0” then the access is allowed. The conditions are evaluated…"
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_allow_upstream string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Defines conditions under which access to a memcached server is allowed or denied. If all string parameters are not empty and not equal to “0” then the access is allowed. The conditions are evaluated each time before a connection to a memcached server is established. Parameter values can contain variables:

```nginx
geo $upstream_last_addr $allow {
    volatile;
    10.10.0.0/24        1;
}

server {
    listen 127.0.0.1:8080;

    location / {
        memcached_pass           host:11211;
        memcached_allow_upstream $allow;
        ...
    }
}
```

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
