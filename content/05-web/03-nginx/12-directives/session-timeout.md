---
title: "session_timeout"
description: "Directive nginx session_timeout (ngx_http_oidc_module) — Sets a timeout after which the session is deleted, unless it was refreshed."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_timeout time;` |
| **Valeur par défaut** | `session_timeout 8h;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Sets a timeout after which the session is deleted, unless it was [refreshed](https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokens).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
