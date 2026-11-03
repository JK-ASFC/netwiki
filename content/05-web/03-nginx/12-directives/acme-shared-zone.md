---
title: "acme_shared_zone"
description: "Directive nginx acme_shared_zone (ngx_http_acme_module) — Allows increasing the size of in-memory storage of the module. The shared memory zone will be used to store the issued certificates, keys and challenge data for all the configured certificate…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `acme_shared_zone zone=name:size;` |
| **Valeur par défaut** | `acme_shared_zone zone=ngx_acme_shared:256k;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Allows increasing the size of in-memory storage of the module. The shared memory zone will be used to store the issued certificates, keys and challenge data for all the configured certificate issuers.

The default zone size is sufficient to hold approximately 50 ECDSA prime256v1 keys or 35 RSA 2048 keys.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
