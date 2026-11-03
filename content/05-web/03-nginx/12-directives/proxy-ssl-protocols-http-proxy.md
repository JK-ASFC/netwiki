---
title: "proxy_ssl_protocols (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_protocols (ngx_http_proxy_module) — Enables the specified protocols for requests to a proxied HTTPS server. NOTE The TLSv1.3 parameter is used by default since 1.23.4."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_protocols [SSLv2] [SSLv3] [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `proxy_ssl_protocols TLSv1.2 TLSv1.3;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.6 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Enables the specified protocols for requests to a proxied HTTPS server.

> [!NOTE]
> The `TLSv1.3` parameter is used by default since 1.23.4.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
