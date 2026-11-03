---
title: "redirect_uri"
description: "Directive nginx redirect_uri (ngx_http_oidc_module) — Defines the Redirection URI path for post-authentication redirects expected by the module from the OpenID Provider. The uri must match the configuration on the Provider's side. Absolute “https” URIs…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `redirect_uri uri;` |
| **Valeur par défaut** | `redirect_uri /oidc_callback;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Defines the Redirection URI path for post-authentication redirects expected by the module from the OpenID Provider. The *uri* must match the configuration on the Provider's side.

Absolute “`https`” URIs are supported since 1.29.0.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
