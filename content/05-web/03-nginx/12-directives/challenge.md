---
title: "challenge"
description: "Directive nginx challenge (ngx_http_acme_module) — Specifies the ACME challenge type to be used for the issuer. Accepted values: - http-01 (http) - tls-alpn-01 (tls-alpn) NOTE ACME challenges are versioned. If an unversioned name is specified, the…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `challenge type;` |
| **Valeur par défaut** | `challenge http-01;` |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.2.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Specifies the ACME challenge type to be used for the issuer.

Accepted values:

- `http-01` (`http`)
- `tls-alpn-01` (`tls-alpn`)

> [!NOTE]
> ACME challenges are versioned. If an unversioned name is specified, the module automatically selects the latest implemented version.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
