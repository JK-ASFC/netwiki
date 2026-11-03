---
title: "session_store"
description: "Directive nginx session_store (ngx_http_oidc_module) — Specifies a custom key-value database that stores session data. By default, an 8-megabyte key-value database named oidc_default_store_<provider name is created automatically. NOTE A separate…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_store name;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Specifies a custom [[12-directives/keyval-zone-http-keyval|key-value database]] that stores session data. By default, an 8-megabyte key-value database named `oidc_default_store_<provider name>` is created automatically.

> [!NOTE]
> A separate key-value database should be configured for each Provider to prevent session reuse across providers.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
