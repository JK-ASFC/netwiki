---
title: "proxy_session_drop"
description: "Directive nginx proxy_session_drop (ngx_stream_proxy_module) — Enables terminating all sessions to a proxied server after it was removed from the group or marked as permanently unavailable. This can occur because of re-resolve or with the API DELETE command. A…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_session_drop on \| off;` |
| **Valeur par défaut** | `proxy_session_drop off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Enables terminating all sessions to a proxied server after it was removed from the group or marked as permanently unavailable. This can occur because of [[12-directives/resolver-stream-core|re-resolve]] or with the API [[11-modules/02-http/ngx_http_api_module|DELETE]] command. A server can be marked as permanently unavailable if it is considered [[12-directives/health-check-stream-upstream-hc|unhealthy]] or with the API [[11-modules/02-http/ngx_http_api_module|PATCH]] command. Each session is terminated when the next read or write event is processed for the client or proxied server.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
