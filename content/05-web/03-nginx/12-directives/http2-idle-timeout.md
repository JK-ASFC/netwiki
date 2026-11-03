---
title: "http2_idle_timeout"
description: "Directive nginx http2_idle_timeout (ngx_http_v2_module) — NOTE This directive is obsolete since version 1.19.7. The keepalive_timeout directive should be used instead. Sets the timeout of inactivity after which the connection is closed."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_idle_timeout time;` |
| **Valeur par défaut** | `http2_idle_timeout 3m;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> This directive is obsolete since version 1.19.7. The [[12-directives/keepalive-timeout-http-core|keepalive_timeout]] directive should be used instead.

Sets the timeout of inactivity after which the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
