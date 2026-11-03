---
title: "memcached_allow_upstream"
description: "Directive nginx memcached_allow_upstream (ngx_http_memcached_module) — Définit les conditions dans lesquelles l'accès à un serveur memcached est autorisé ou refusé. Si toutes les chaînes en paramètre ne sont ni vides ni égales à « 0 », l'accès est autorisé. Les…"
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_allow_upstream string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Définit les conditions dans lesquelles l'accès à un serveur memcached est autorisé ou refusé. Si toutes les chaînes en paramètre ne sont ni vides ni égales à « 0 », l'accès est autorisé. Les conditions sont évaluées avant chaque connexion au serveur memcached. Les valeurs des paramètres peuvent contenir des variables :

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
