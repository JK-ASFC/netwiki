---
title: "ssl_protocols (ngx_http_ssl_module)"
description: "Directive nginx ssl_protocols (ngx_http_ssl_module) — Enables the specified protocols. If the directive is specified on the server level, the value from the default server can be used. Details are provided in the “Virtual server selection” section. NOTE…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_protocols [SSLv2] [SSLv3] [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `ssl_protocols TLSv1.2 TLSv1.3;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Enables the specified protocols.

If the directive is specified on the [[12-directives/server-http-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

> [!NOTE]
> The `TLSv1.1` and `TLSv1.2` parameters (1.1.13, 1.0.12) work only when OpenSSL 1.0.1 or higher is used.

> [!NOTE]
> The `TLSv1.3` parameter (1.13.0) works only when OpenSSL 1.1.1 or higher is used.

> [!NOTE]
> The `TLSv1.3` parameter is used by default since 1.23.4.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
