---
title: "extra_auth_args"
description: "Directive nginx extra_auth_args (ngx_http_oidc_module) — Sets additional query arguments for the authentication request URL. nginx extra_auth_args \"display=page&prompt=login\";"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `extra_auth_args string;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Sets additional query arguments for the [authentication request](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) URL.

```nginx
extra_auth_args "display=page&prompt=login";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
