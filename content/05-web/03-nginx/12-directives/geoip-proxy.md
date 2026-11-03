---
title: "geoip_proxy"
description: "Directive nginx geoip_proxy (ngx_http_geoip_module) — Defines trusted addresses. When a request comes from a trusted address, an address from the X-Forwarded-For request header field will be used instead."
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_proxy address \| CIDR;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.3.0, 1.2.1 |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Defines trusted addresses. When a request comes from a trusted address, an address from the `X-Forwarded-For` request header field will be used instead.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
