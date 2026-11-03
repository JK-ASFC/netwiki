---
title: "logout_token_hint"
description: "Directive nginx logout_token_hint (ngx_http_oidc_module) — Adds the id_token_hint argument to the Provider's Logout Endpoint when redirecting user during logout. This argument can be required by some OpenID Providers."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `logout_token_hint on \| off;` |
| **Valeur par défaut** | `logout_token_hint off;` |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Adds the [`id_token_hint`](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout) argument to the [Provider's Logout Endpoint](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#OPMetadata) when redirecting user during logout. This argument can be required by some OpenID Providers.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
