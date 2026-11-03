---
title: "account_key"
description: "Directive nginx account_key (ngx_http_acme_module) — The account's private key used for request authentication. Accepted values: - ecdsa:256/384/521 for ES256, ES384, or ES512 JSON Web Signature algorithms - rsa:2048/3072/4096 for RS256. - File path…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `account_key alg[:size] \| file;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

The account's private key used for request authentication.

Accepted values:

- `ecdsa`:*256*/*384*/*521* for ES256, ES384, or ES512 JSON Web Signature algorithms
- `rsa`:*2048*/*3072*/*4096* for RS256.
- File path for an existing key, using one of the algorithms above.

The generated account keys are preserved across reloads, but will be lost on restart unless [[12-directives/state-path-http-acme|state_path]] is configured.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
