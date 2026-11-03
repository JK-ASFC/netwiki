---
title: "db_get"
description: "Directive nginx db_get (ngx_http_db_module) — Indique la clé à récupérer dans la base. La clé peut contenir du texte, des variables ou une combinaison des deux. Une clé vide n'est pas autorisée. Avec Redis, la clé est transmise à la commande…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_get key;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique la clé à récupérer dans la base. La clé peut contenir du texte, des variables ou une combinaison des deux. Une clé vide n'est pas autorisée.

Avec Redis, la clé est transmise à la commande `GET`. Une recherche réussie renvoie la valeur comme corps de réponse.

```nginx
upstream redis_backend {
    db_type redis;
    server  127.0.0.1:6379;
}

server {
    location /db/ {
        db_pass redis_backend;
        db_get  "user:$arg_id";
    }
}
```

Si la mise en cache est [[12-directives/db-cache|activée]], la clé évaluée sert aussi de clé de cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
