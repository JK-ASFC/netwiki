---
title: "limit_zone"
description: "Directive nginx limit_zone (ngx_http_limit_conn_module) — This directive was made obsolete in version 1.1.8 and was removed in version 1.7.6. An equivalent limit_conn_zone directive with a changed syntax should be used instead: NOTE limit_conn_zone…"
tags: [nginx, directive, ngx_http_limit_conn_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_zone name $variable size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_limit_conn_module\|ngx_http_limit_conn_module]] |

## Utilisation

This directive was made obsolete in version 1.1.8 and was removed in version 1.7.6. An equivalent [[12-directives/limit-conn-zone-http-limit-conn|limit_conn_zone]] directive with a changed syntax should be used instead:

> [!NOTE]
> `limit_conn_zone` *$variable* `zone`=*name*:*size*;

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
