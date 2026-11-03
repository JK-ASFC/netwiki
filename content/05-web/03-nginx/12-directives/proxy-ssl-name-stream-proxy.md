---
title: "proxy_ssl_name (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_name (ngx_stream_proxy_module) — Allows overriding the server name used to verify the certificate of the proxied server and to be passed through SNI when establishing a connection with the proxied server. The server name can also be…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_name name;` |
| **Valeur par défaut** | `proxy_ssl_name host from proxy_pass;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Allows overriding the server name used to [[12-directives/proxy-ssl-verify-stream-proxy|verify]] the certificate of the proxied server and to be [[12-directives/proxy-ssl-server-name-stream-proxy|passed through SNI]] when establishing a connection with the proxied server. The server name can also be specified using variables (1.11.3).

By default, the host part of the [[12-directives/proxy-pass-stream-proxy|proxy_pass]] address is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
