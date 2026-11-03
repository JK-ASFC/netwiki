---
title: "ssl_trusted_certificate (ngx_http_acme_module)"
description: "Directive nginx ssl_trusted_certificate (ngx_http_acme_module) — Indique le fichier (file) contenant les certificats d'autorités de confiance au format PEM utilisé pour vérifier le certificat du serveur ACME."
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats d'autorités de confiance au format PEM utilisé pour [[12-directives/ssl-verify-http-acme|vérifier]] le certificat du serveur ACME.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
