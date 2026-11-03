---
title: "proxy_half_close"
description: "Directive nginx proxy_half_close (ngx_stream_proxy_module) — Enables or disables closing each direction of a TCP connection independently (“TCP half-close”). If enabled, proxying over TCP will be kept until both sides close the connection."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_half_close on \| off;` |
| **Valeur par défaut** | `proxy_half_close off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Enables or disables closing each direction of a TCP connection independently (“TCP half-close”). If enabled, proxying over TCP will be kept until both sides close the connection.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
