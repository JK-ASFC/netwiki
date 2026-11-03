---
title: "proxy_bind_dynamic (ngx_stream_proxy_module)"
description: "Directive nginx proxy_bind_dynamic (ngx_stream_proxy_module) — When enabled, makes the bind operation at each connection attempt. NOTE This directive is available as part of our abonnement commercial."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_bind_dynamic on \| off;` |
| **Valeur par défaut** | `proxy_bind_dynamic off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

When enabled, makes the [[12-directives/proxy-bind-stream-proxy|bind]] operation at each connection attempt.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
