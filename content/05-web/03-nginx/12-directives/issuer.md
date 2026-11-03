---
title: "issuer"
description: "Directive nginx issuer (ngx_http_oidc_module) — Sets the Issuer Identifier URL of the OpenID Provider; required directive. The URL must exactly match the value of “issuer” in the OpenID Provider metadata and requires the “https” scheme."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `issuer URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Sets the Issuer Identifier URL of the OpenID Provider; required directive. The URL must exactly match the value of “`issuer`” in the OpenID Provider metadata and requires the “`https`” scheme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
