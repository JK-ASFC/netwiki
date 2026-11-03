---
title: "proxy_ssl_alpn"
description: "Directive nginx proxy_ssl_alpn (ngx_stream_proxy_module) — Specifies the list of protocols to advertise via the ALPN extension when establishing a connection with the proxied server. For example: nginx proxy_ssl_alpn h2 http/1.1; Parameter value can contain…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_alpn protocol ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.31.0 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Specifies the list of protocols to advertise via the [ALPN](https://datatracker.ietf.org/doc/html/rfc7301) extension when establishing a connection with the proxied server. For example:

```nginx
proxy_ssl_alpn h2 http/1.1;
```

Parameter value can contain variables:

```nginx
proxy_ssl_alpn $ssl_alpn_protocol;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
