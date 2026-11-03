---
title: "grpc_ssl_trusted_certificate"
description: "Directive nginx grpc_ssl_trusted_certificate (ngx_http_grpc_module) — Indique le fichier (file) contenant les certificats d'autorités de confiance au format PEM utilisé pour vérifier le certificat du serveur gRPC SSL."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats d'autorités de confiance au format PEM utilisé pour [[12-directives/grpc-ssl-verify|vérifier]] le certificat du serveur gRPC SSL.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
