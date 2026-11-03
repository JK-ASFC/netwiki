---
title: "grpc_ssl_certificate_key"
description: "Directive nginx grpc_ssl_certificate_key (ngx_http_grpc_module) — Indique le fichier (file) contenant la clé secrète au format PEM utilisée pour s'authentifier auprès d'un serveur gRPC SSL. On peut indiquer engine:name:id à la place de file pour charger la clé…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Indique le fichier (*file*) contenant la clé secrète au format PEM utilisée pour s'authentifier auprès d'un serveur gRPC SSL.

On peut indiquer `engine`:*name*:*id* à la place de *file* pour charger la clé secrète d'identifiant *id* depuis le moteur OpenSSL *name*.

On peut indiquer `store`:*scheme*:*id* à la place de *file* (1.29.0) pour charger la clé secrète d'identifiant *id* via le schéma d'URI *scheme* enregistré par un fournisseur OpenSSL, par exemple [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

Depuis la version 1.21.0, le nom de fichier (*file*) peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
