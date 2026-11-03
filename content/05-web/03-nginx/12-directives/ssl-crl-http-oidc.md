---
title: "ssl_crl (ngx_http_oidc_module)"
description: "Directive nginx ssl_crl (ngx_http_oidc_module) — Indique le fichier (file) contenant les certificats révoqués (CRL) au format PEM utilisé pour vérifier les certificats des points de terminaison du fournisseur OpenID. Avec des certificats…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats révoqués (CRL) au format PEM utilisé pour vérifier les certificats des points de terminaison du fournisseur OpenID. Avec des certificats intermédiaires, leurs CRL doivent figurer dans le même fichier.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
