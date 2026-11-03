---
title: "acme_certificate"
description: "Directive nginx acme_certificate (ngx_http_acme_module) — Defines a certificate with the list of identifiers requested from issuer issuer. The explicit list of identifiers can be omitted. In this case, the identifiers will be taken from the server_name…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `acme_certificate issuer [identifier ...] [key=alg[:size]];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Defines a certificate with the list of `identifiers` requested from issuer `issuer`.

The explicit list of identifiers can be omitted. In this case, the identifiers will be taken from the [[12-directives/server-name-http-core|server_name]] directive in the same [[12-directives/server-http-core|server]] block. Not all values accepted in the `server_name` are valid certificate identifiers: regular expressions and wildcards are not supported.

The key parameter sets the type of a generated private key. Supported key algorithms and sizes: `ecdsa:256` (default), `ecdsa:384`, `ecdsa:521`, `rsa:2048`, `rsa:3072`, `rsa:4096`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
