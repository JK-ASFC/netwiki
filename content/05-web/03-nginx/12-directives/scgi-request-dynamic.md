---
title: "scgi_request_dynamic"
description: "Directive nginx scgi_request_dynamic (ngx_http_scgi_module) — Enables or disables creation of a separate request instance for each SCGI server. By default, a single request is used for all SCGI servers. If enabled, a separate request instance is created,…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_request_dynamic on \| off;` |
| **Valeur par défaut** | `scgi_request_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Enables or disables creation of a separate request instance for each SCGI server. By default, a single request is used for all SCGI servers. If enabled, a separate request instance is created, allowing per-server request customization.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
