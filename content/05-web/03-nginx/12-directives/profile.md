---
title: "profile"
description: "Directive nginx profile (ngx_http_acme_module) — Requests the certificate profile name from the ACME server. The require parameter will cause certificate renewals to fail if the server does not support the specified profile."
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `profile name [require];` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.3.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Requests the [certificate profile](https://datatracker.ietf.org/doc/html/draft-ietf-acme-profiles) *name* from the ACME server.

The `require` parameter will cause certificate renewals to fail if the server does not support the specified profile.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
