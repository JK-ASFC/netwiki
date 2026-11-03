---
title: "queue"
description: "Directive nginx queue (ngx_http_upstream_module) — If an upstream server cannot be selected immediately while processing a request, the request will be placed into the queue. The directive specifies the maximum number of requests that can be in the…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `queue number [timeout=time];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.5.12 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

If an upstream server cannot be selected immediately while processing a request, the request will be placed into the queue. The directive specifies the maximum *number* of requests that can be in the queue at the same time. If the queue is filled up, or the server to pass the request to cannot be selected within the time period specified in the `timeout` parameter, the `502 Bad Gateway` error will be returned to the client.

The default value of the `timeout` parameter is 60 seconds.

> [!NOTE]
> When using load balancer methods other than the default round-robin method, it is necessary to activate them before the `queue` directive.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
