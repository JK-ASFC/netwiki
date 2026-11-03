---
title: "grpc_ssl_ciphers"
description: "Directive nginx grpc_ssl_ciphers (ngx_http_grpc_module) — Specifies the enabled ciphers for requests to a gRPC SSL server. The ciphers are specified in the format understood by the OpenSSL library. La liste complète s'affiche avec la commande « openssl…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `grpc_ssl_ciphers DEFAULT;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Specifies the enabled ciphers for requests to a gRPC SSL server. The ciphers are specified in the format understood by the OpenSSL library.

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
