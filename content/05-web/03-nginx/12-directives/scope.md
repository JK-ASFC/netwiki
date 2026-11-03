---
title: "scope"
description: "Directive nginx scope (ngx_http_oidc_module) — Sets requested scopes. The openid scope is always required by OIDC."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scope scope ...;` |
| **Valeur par défaut** | `scope openid;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Sets requested scopes. The `openid` scope is always required by OIDC.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
