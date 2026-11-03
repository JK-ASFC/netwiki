---
title: "server_tokens"
description: "Directive nginx server_tokens (ngx_http_core_module) — Enables or disables emitting nginx version on error pages and in the Server response header field. The build parameter (1.11.10) enables emitting a build name along with nginx version. Additionally,…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_tokens on \| off \| build \| string;` |
| **Valeur par défaut** | `server_tokens on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables emitting nginx version on error pages and in the `Server` response header field.

The `build` parameter (1.11.10) enables emitting a [[10-guides/01-introduction/configure|build name]] along with nginx version.

Additionally, as part of our [abonnement commercial](https://nginx.com/products/), starting from version 1.9.13 the signature on error pages and the `Server` response header field value can be set explicitly using the *string* with variables. An empty string disables the emission of the `Server` field.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
