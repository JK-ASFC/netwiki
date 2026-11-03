---
title: "client_secret"
description: "Directive nginx client_secret (ngx_http_oidc_module) — Indique un secret servant à authentifier la partie de confiance auprès du fournisseur OpenID. Les méthodes d'authentification prises en charge sont client_secret_basic et client_secret_post (1.29.3).…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_secret string;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Indique un secret servant à authentifier la partie de confiance auprès du fournisseur OpenID. Les [méthodes d'authentification](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication) prises en charge sont `client_secret_basic` et `client_secret_post` (1.29.3). La méthode est choisie d'après les métadonnées du fournisseur, avec une préférence pour `client_secret_basic`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
