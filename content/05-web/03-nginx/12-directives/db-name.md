---
title: "db_name"
description: "Directive nginx db_name (ngx_http_db_module) — Définit la base de données utilisée pour les recherches. Avec Redis, le paramètre indique l'index de base transmis à la commande SELECT. Si la directive n'est pas indiquée ou que sa valeur est vide,…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_name string;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Définit la base de données utilisée pour les recherches.

Avec Redis, le paramètre indique l'index de base transmis à la commande `SELECT`. Si la directive n'est pas indiquée ou que sa valeur est vide, la base `0` est utilisée :

```nginx
location /db/ {
    db_pass redis_backend;
    db_name 3;
    db_get  $arg_key;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
