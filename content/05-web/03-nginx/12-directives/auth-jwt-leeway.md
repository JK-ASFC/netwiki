---
title: "auth_jwt_leeway"
description: "Directive nginx auth_jwt_leeway (ngx_http_auth_jwt_module) — Sets the maximum allowable leeway to compensate clock skew when verifying the exp and nbf JWT claims."
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_leeway time;` |
| **Valeur par défaut** | `auth_jwt_leeway 0s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.13.10 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Sets the maximum allowable leeway to compensate clock skew when verifying the [exp](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4) and [nbf](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.5) JWT claims.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
