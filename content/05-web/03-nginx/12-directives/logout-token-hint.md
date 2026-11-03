---
title: "logout_token_hint"
description: "Directive nginx logout_token_hint (ngx_http_oidc_module) — Ajoute l'argument id_token_hint au point de terminaison de déconnexion du fournisseur lors de la redirection de l'utilisateur à la déconnexion. Certains fournisseurs OpenID l'exigent."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `logout_token_hint on \| off;` |
| **Valeur par défaut** | `logout_token_hint off;` |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Ajoute l'argument [`id_token_hint`](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout) au [point de terminaison de déconnexion du fournisseur](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#OPMetadata) lors de la redirection de l'utilisateur à la déconnexion. Certains fournisseurs OpenID l'exigent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
