---
title: "limit_rate_after"
description: "Directive nginx limit_rate_after (ngx_http_core_module) — Sets the initial amount after which the further transmission of a response to a client will be rate limited. Parameter value can contain variables (1.17.0). Example: nginx location /flv/ { flv;…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_rate_after size;` |
| **Valeur par défaut** | `limit_rate_after 0;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Apparue dans la version** | 0.8.0 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the initial amount after which the further transmission of a response to a client will be rate limited. Parameter value can contain variables (1.17.0).

Example:

```nginx
location /flv/ {
    flv;
    limit_rate_after 500k;
    limit_rate       50k;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
