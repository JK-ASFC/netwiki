---
title: "logout_uri"
description: "Directive nginx logout_uri (ngx_http_oidc_module) — Defines the URI path for initiating session logout. Upon session termination, the user is redirected to Provider's Logout Endpoint or to the post logout page. If neither is configured, the built-in…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `logout_uri uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Defines the URI path for initiating session logout. Upon session termination, the user is redirected to [Provider's Logout Endpoint](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#OPMetadata) or to the [[12-directives/post-logout-uri|post logout page]]. If neither is configured, the built-in post logout page is displayed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
