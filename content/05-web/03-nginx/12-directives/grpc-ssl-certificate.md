---
title: "grpc_ssl_certificate"
description: "Directive nginx grpc_ssl_certificate (ngx_http_grpc_module) — Indique le fichier (file) contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur gRPC SSL. Depuis la version 1.21.0, le nom de fichier (file) peut contenir des…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Indique le fichier (*file*) contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur gRPC SSL.

Depuis la version 1.21.0, le nom de fichier (*file*) peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
