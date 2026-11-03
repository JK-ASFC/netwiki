---
title: "proxy_bind_dynamic (ngx_http_proxy_module)"
description: "Directive nginx proxy_bind_dynamic (ngx_http_proxy_module) — When enabled, makes the bind operation at each connection attempt. NOTE Cette directive est disponible dans le cadre de notre abonnement commercial."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_bind_dynamic on \| off;` |
| **Valeur par défaut** | `proxy_bind_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

When enabled, makes the [[12-directives/proxy-bind-http-proxy|bind]] operation at each connection attempt.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
