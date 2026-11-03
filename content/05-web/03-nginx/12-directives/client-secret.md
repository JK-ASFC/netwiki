---
title: "client_secret"
description: "Directive nginx client_secret (ngx_http_oidc_module) — Specifies a secret value used to authenticate the Relying Party with the OpenID Provider. The supported authentication methods are client_secret_basic and client_secret_post (1.29.3). The method is…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_secret string;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Specifies a secret value used to authenticate the Relying Party with the OpenID Provider. The supported [authentication methods](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication) are `client_secret_basic` and `client_secret_post` (1.29.3). The method is selected based on the OpenID Provider metadata with a preference to `client_secret_basic`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
