---
title: "real_ip_header"
description: "Directive nginx real_ip_header (ngx_http_realip_module) — Defines the request header field whose value will be used to replace the client address. The request header field value that contains an optional port is also used to replace the client port…"
tags: [nginx, directive, ngx_http_realip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `real_ip_header field \| X-Real-IP \| X-Forwarded-For \| proxy_protocol;` |
| **Valeur par défaut** | `real_ip_header X-Real-IP;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_realip_module\|ngx_http_realip_module]] |

## Utilisation

Defines the request header field whose value will be used to replace the client address.

The request header field value that contains an optional port is also used to replace the client port (1.11.0). The address and port should be specified according to [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986).

The `proxy_protocol` parameter (1.5.12) changes the client address to the one from the PROXY protocol header. The PROXY protocol must be previously enabled by setting the `proxy_protocol` parameter in the [[12-directives/listen-http-core|listen]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
