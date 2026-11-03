---
title: "grpc_ssl_ciphers"
description: "Directive nginx grpc_ssl_ciphers (ngx_http_grpc_module) — Indique les suites de chiffrement activées pour les requêtes vers un serveur gRPC SSL. Elles s'écrivent au format reconnu par la bibliothèque OpenSSL. La liste complète s'affiche avec la commande «…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `grpc_ssl_ciphers DEFAULT;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Indique les suites de chiffrement activées pour les requêtes vers un serveur gRPC SSL. Elles s'écrivent au format reconnu par la bibliothèque OpenSSL.

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
