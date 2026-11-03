---
title: "db_type"
description: "Directive nginx db_type (ngx_http_db_module) — Définit le protocole de base de données utilisé par le groupe amont. Actuellement, seul redis est pris en charge : nginx upstream redis_backend { server 127.0.0.1:6379; db_type redis; } Le nom du…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_type type;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Définit le protocole de base de données utilisé par le groupe amont. Actuellement, seul `redis` est pris en charge :

```nginx
upstream redis_backend {
    server  127.0.0.1:6379;
    db_type redis;
}
```

Le nom du protocole est insensible à la casse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
