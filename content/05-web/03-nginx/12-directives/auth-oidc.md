---
title: "auth_oidc"
description: "Directive nginx auth_oidc (ngx_http_oidc_module) — Enables end user authentication with the specified OpenID Provider. Parameter value can contain variables (1.29.0). The special value off cancels the effect of the auth_oidc directive inherited from…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_oidc name \| off;` |
| **Valeur par défaut** | `auth_oidc off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Enables end user authentication with the [[12-directives/oidc-provider|specified]] OpenID Provider.

Parameter value can contain variables (1.29.0).

The special value `off` cancels the effect of the `auth_oidc` directive inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
