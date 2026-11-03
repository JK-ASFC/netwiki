---
title: "proxy_bind_dynamic (ngx_stream_proxy_module)"
description: "Directive nginx proxy_bind_dynamic (ngx_stream_proxy_module) — Si cette option est activée, l'opération bind est effectuée à chaque tentative de connexion. NOTE Cette directive est disponible dans le cadre de notre abonnement commercial."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_bind_dynamic on \| off;` |
| **Valeur par défaut** | `proxy_bind_dynamic off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Si cette option est activée, l'opération [[12-directives/proxy-bind-stream-proxy|bind]] est effectuée à chaque tentative de connexion.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
