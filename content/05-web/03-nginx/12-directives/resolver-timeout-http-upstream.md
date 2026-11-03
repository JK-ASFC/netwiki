---
title: "resolver_timeout (ngx_http_upstream_module)"
description: "Directive nginx resolver_timeout (ngx_http_upstream_module) — Définit le délai de résolution des noms, par exemple : nginx resolver_timeout 5s; NOTE De la version 1.17.5 à la version 1.27.3, cette directive n'était disponible que dans le cadre de notre…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver_timeout time;` |
| **Valeur par défaut** | `resolver_timeout 30s;` |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.27.3 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Définit le délai de résolution des noms, par exemple :

```nginx
resolver_timeout 5s;
```

> [!NOTE]
> De la version 1.17.5 à la version 1.27.3, cette directive n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
