---
title: "geoip_proxy_recursive"
description: "Directive nginx geoip_proxy_recursive (ngx_http_geoip_module) — If recursive search is disabled then instead of the original client address that matches one of the trusted addresses, the last address sent in X-Forwarded-For will be used. If recursive search is…"
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_proxy_recursive on \| off;` |
| **Valeur par défaut** | `geoip_proxy_recursive off;` |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.3.0, 1.2.1 |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

If recursive search is disabled then instead of the original client address that matches one of the trusted addresses, the last address sent in `X-Forwarded-For` will be used. If recursive search is enabled then instead of the original client address that matches one of the trusted addresses, the last non-trusted address sent in `X-Forwarded-For` will be used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
