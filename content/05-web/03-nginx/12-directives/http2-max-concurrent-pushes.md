---
title: "http2_max_concurrent_pushes"
description: "Directive nginx http2_max_concurrent_pushes (ngx_http_v2_module) — NOTE This directive is obsolete since version 1.25.1. Limits the maximum number of concurrent push requests in a connection."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_max_concurrent_pushes number;` |
| **Valeur par défaut** | `http2_max_concurrent_pushes 10;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.13.9 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> This directive is obsolete since version 1.25.1.

Limits the maximum number of concurrent [[12-directives/http2-push|push]] requests in a connection.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
