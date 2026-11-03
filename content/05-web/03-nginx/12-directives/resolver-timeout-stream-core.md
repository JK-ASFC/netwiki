---
title: "resolver_timeout (ngx_stream_core_module)"
description: "Directive nginx resolver_timeout (ngx_stream_core_module) — Définit le délai de résolution des noms, par exemple : nginx resolver_timeout 5s; NOTE Avant la version 1.11.3, cette directive faisait partie de notre abonnement commercial."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver_timeout time;` |
| **Valeur par défaut** | `resolver_timeout 30s;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit le délai de résolution des noms, par exemple :

```nginx
resolver_timeout 5s;
```

> [!NOTE]
> Avant la version 1.11.3, cette directive faisait partie de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
