---
title: "pkce"
description: "Directive nginx pkce (ngx_http_oidc_module) — Explicitly enables or disables PKCE. By default, PKCE is automatically enabled based on OpenID Provider metadata."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pkce on \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Explicitly enables or disables PKCE. By default, PKCE is automatically enabled based on OpenID Provider metadata.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
