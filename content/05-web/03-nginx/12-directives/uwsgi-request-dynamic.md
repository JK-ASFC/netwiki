---
title: "uwsgi_request_dynamic"
description: "Directive nginx uwsgi_request_dynamic (ngx_http_uwsgi_module) — Enables or disables creation of a separate request instance for each uwsgi server. By default, a single request is used for all uwsgi servers. If enabled, a separate request instance is created,…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_request_dynamic on \| off;` |
| **Valeur par défaut** | `uwsgi_request_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Enables or disables creation of a separate request instance for each uwsgi server. By default, a single request is used for all uwsgi servers. If enabled, a separate request instance is created, allowing per-server request customization.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
