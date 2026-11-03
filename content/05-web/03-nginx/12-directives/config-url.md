---
title: "config_url"
description: "Directive nginx config_url (ngx_http_oidc_module) — Sets a custom URL to retrieve the OpenID Provider metadata."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `config_url URL;` |
| **Valeur par défaut** | `config_url <issuer>/.well-known/openid-configuration;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Sets a custom URL to retrieve the OpenID Provider metadata.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
