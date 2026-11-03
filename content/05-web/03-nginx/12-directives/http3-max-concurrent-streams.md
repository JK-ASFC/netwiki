---
title: "http3_max_concurrent_streams"
description: "Directive nginx http3_max_concurrent_streams (ngx_http_v3_module) — Sets the maximum number of concurrent HTTP/3 request streams in a connection."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http3_max_concurrent_streams number;` |
| **Valeur par défaut** | `http3_max_concurrent_streams 128;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Sets the maximum number of concurrent HTTP/3 request streams in a connection.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
