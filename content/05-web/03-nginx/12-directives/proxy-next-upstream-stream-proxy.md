---
title: "proxy_next_upstream (ngx_stream_proxy_module)"
description: "Directive nginx proxy_next_upstream (ngx_stream_proxy_module) — When a connection to the proxied server cannot be established, determines whether a client connection will be passed to the next server. Passing a connection to the next server can be limited by the…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_next_upstream on \| off;` |
| **Valeur par défaut** | `proxy_next_upstream on;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

When a connection to the proxied server cannot be established, determines whether a client connection will be passed to the next server.

Passing a connection to the next server can be limited by [[12-directives/proxy-next-upstream-tries-stream-proxy|the number of tries]] and by [[12-directives/proxy-next-upstream-timeout-stream-proxy|time]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
