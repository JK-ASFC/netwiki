---
title: "resolver_timeout (ngx_stream_upstream_module)"
description: "Directive nginx resolver_timeout (ngx_stream_upstream_module) — Sets a timeout for name resolution, for example: nginx resolver_timeout 5s; NOTE Since version 1.17.5 and prior to version 1.27.3, this directive was available only as part of our abonnement…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver_timeout time;` |
| **Valeur par défaut** | `resolver_timeout 30s;` |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.27.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Sets a timeout for name resolution, for example:

```nginx
resolver_timeout 5s;
```

> [!NOTE]
> Since version 1.17.5 and prior to version 1.27.3, this directive was available only as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
