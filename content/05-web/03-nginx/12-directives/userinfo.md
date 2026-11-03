---
title: "userinfo"
description: "Directive nginx userinfo (ngx_http_oidc_module) — Enables downloading of the UserInfo data and makes UserInfo claims available via the $oidc_claim_name variables."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userinfo on \| off;` |
| **Valeur par défaut** | `userinfo off;` |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Enables downloading of the [UserInfo](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo) data and makes UserInfo claims available via the $oidc\_claim\_`name` variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
