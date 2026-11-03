---
title: "frontchannel_logout_uri"
description: "Directive nginx frontchannel_logout_uri (ngx_http_oidc_module) — Defines the URI path for triggering front-channel logout. For the logout request to be associated with a user session, it must either include the module session cookie or provide both the “iss” and…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `frontchannel_logout_uri uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Defines the URI path for triggering [front-channel logout](https://openid.net/specs/openid-connect-frontchannel-1_0.html). For the logout request to be associated with a user session, it must either include the module session cookie or provide both the “`iss`” and “`sid`” arguments. It is recommended to configure the OpenID Provider to set the “`iss`” and “`sid`” arguments when invoking this endpoint.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
