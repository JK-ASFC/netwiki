---
title: "uwsgi_bind_dynamic"
description: "Directive nginx uwsgi_bind_dynamic (ngx_http_uwsgi_module) — When enabled, makes the bind operation at each connection attempt. NOTE This directive is available as part of our abonnement commercial."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_bind_dynamic on \| off;` |
| **Valeur par défaut** | `uwsgi_bind_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

When enabled, makes the [[12-directives/uwsgi-bind|bind]] operation at each connection attempt.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
