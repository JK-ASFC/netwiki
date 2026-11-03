---
title: "accept_terms_of_service"
description: "Directive nginx accept_terms_of_service (ngx_http_acme_module) — Agrees to the terms of service under which the ACME server will be used. Some servers require accepting the terms of service before account registration. The terms are usually available on the ACME…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `accept_terms_of_service;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Agrees to the terms of service under which the ACME server will be used. Some servers require accepting the terms of service before account registration. The terms are usually available on the ACME server's website, and the URL will be printed to the error log if necessary.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
