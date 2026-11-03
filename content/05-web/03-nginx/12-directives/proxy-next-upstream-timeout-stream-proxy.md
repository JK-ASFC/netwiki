---
title: "proxy_next_upstream_timeout (ngx_stream_proxy_module)"
description: "Directive nginx proxy_next_upstream_timeout (ngx_stream_proxy_module) — Limits the time allowed to pass a connection to the next server. The 0 value turns off this limitation."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_next_upstream_timeout time;` |
| **Valeur par défaut** | `proxy_next_upstream_timeout 0;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Limits the time allowed to pass a connection to the [[12-directives/proxy-next-upstream-stream-proxy|next server]]. The `0` value turns off this limitation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
