---
title: "proxy_requests"
description: "Directive nginx proxy_requests (ngx_stream_proxy_module) — Sets the number of client datagrams at which binding between a client and existing UDP stream session is dropped. After receiving the specified number of datagrams, next datagram from the same client…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_requests number;` |
| **Valeur par défaut** | `proxy_requests 0;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.7 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Sets the number of client datagrams at which binding between a client and existing UDP stream session is dropped. After receiving the specified number of datagrams, next datagram from the same client starts a new session. The session terminates when all client datagrams are transmitted to a proxied server and the expected number of [[12-directives/proxy-responses|responses]] is received, or when it reaches a [[12-directives/proxy-timeout-stream-proxy|timeout]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
