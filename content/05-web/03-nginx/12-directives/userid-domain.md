---
title: "userid_domain"
description: "Directive nginx userid_domain (ngx_http_userid_module) — Defines a domain for which the cookie is set. The none parameter disables setting of a domain for the cookie."
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_domain name \| none;` |
| **Valeur par défaut** | `userid_domain none;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Defines a domain for which the cookie is set. The `none` parameter disables setting of a domain for the cookie.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
