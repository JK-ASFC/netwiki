---
title: "external_account_key"
description: "Directive nginx external_account_key (ngx_http_acme_module) — Specifies a key identifier kid and a file with the MAC key for external account authorization. The value data:key can be specified instead of the file, which loads a key directly from the…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `external_account_key kid file;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.2.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Specifies a key identifier *kid* and a *file* with the MAC key for [external account authorization](https://datatracker.ietf.org/doc/html/rfc8555#section-7.3.4).

The value `data`:*key* can be specified instead of the *file*, which loads a key directly from the configuration without using intermediate files.

In both cases, the key is expected to be encoded in [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
