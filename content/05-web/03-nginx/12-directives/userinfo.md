---
title: "userinfo"
description: "Directive nginx userinfo (ngx_http_oidc_module) — Active le téléchargement des données UserInfo et rend leurs revendications accessibles par les variables $oidc_claim_name."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userinfo on \| off;` |
| **Valeur par défaut** | `userinfo off;` |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Active le téléchargement des données [UserInfo](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo) et rend leurs revendications accessibles par les variables $oidc\_claim\_`name`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
