---
title: "tunnel_allow_upstream"
description: "Directive nginx tunnel_allow_upstream (ngx_http_tunnel_module) — Définit les conditions dans lesquelles l'accès au serveur d'arrière-plan est autorisé ou refusé. Si toutes les chaînes en paramètre ne sont ni vides ni égales à « 0 », l'accès est autorisé. Les…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_allow_upstream string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Définit les conditions dans lesquelles l'accès au serveur d'arrière-plan est autorisé ou refusé. Si toutes les chaînes en paramètre ne sont ni vides ni égales à « 0 », l'accès est autorisé. Les conditions sont évaluées avant chaque connexion au serveur d'arrière-plan. Les valeurs des paramètres peuvent contenir des variables :

```nginx
geo $upstream_last_addr $allow {
    volatile;
    10.10.0.0/24        1;
}

server {
    listen 127.0.0.1:8080;

    tunnel_pass;
    tunnel_allow_upstream $allow;
}
```

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
