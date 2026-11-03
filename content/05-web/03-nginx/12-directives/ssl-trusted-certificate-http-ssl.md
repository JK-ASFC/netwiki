---
title: "ssl_trusted_certificate (ngx_http_ssl_module)"
description: "Directive nginx ssl_trusted_certificate (ngx_http_ssl_module) — Indique le fichier (file) contenant les certificats d'autorités de confiance au format PEM utilisé pour vérifier les certificats des clients et les réponses OCSP si ssl_stapling est activé.…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.3.7 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats d'autorités de confiance au format PEM utilisé pour [[12-directives/ssl-verify-client-http-ssl|vérifier]] les certificats des clients et les réponses OCSP si [[12-directives/ssl-stapling-http-ssl|ssl_stapling]] est activé.

Contrairement au certificat défini par [[12-directives/ssl-client-certificate-http-ssl|ssl_client_certificate]], la liste de ces certificats n'est pas envoyée aux clients.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
