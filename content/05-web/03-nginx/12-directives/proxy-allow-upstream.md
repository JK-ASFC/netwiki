---
title: "proxy_allow_upstream"
description: "Directive nginx proxy_allow_upstream (ngx_http_proxy_module) — Définit les conditions dans lesquelles l'accès à un serveur mandaté est autorisé ou refusé. Si toutes les chaînes en paramètre ne sont ni vides ni égales à « 0 », l'accès est autorisé. Les conditions…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_allow_upstream string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit les conditions dans lesquelles l'accès à un serveur mandaté est autorisé ou refusé. Si toutes les chaînes en paramètre ne sont ni vides ni égales à « 0 », l'accès est autorisé. Les conditions sont évaluées avant chaque connexion au serveur mandaté. Les valeurs des paramètres peuvent contenir des variables :

```nginx
geo $upstream_last_addr $allow {
    volatile;
    10.10.0.0/24        1;
}

server {
    listen 127.0.0.1:8080;

    location / {
        proxy_pass           localhost:8000;
        proxy_allow_upstream $allow;
        ...
    }
}
```

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
