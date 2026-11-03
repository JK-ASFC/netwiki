---
title: "resolver_timeout (ngx_http_core_module)"
description: "Directive nginx resolver_timeout (ngx_http_core_module) — Définit le délai de résolution des noms, par exemple : nginx resolver_timeout 5s;"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver_timeout time;` |
| **Valeur par défaut** | `resolver_timeout 30s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le délai de résolution des noms, par exemple :

```nginx
resolver_timeout 5s;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
