---
title: "grpc_buffer_size"
description: "Directive nginx grpc_buffer_size (ngx_http_grpc_module) — Définit la taille (size) du tampon utilisé pour lire la réponse reçue du serveur gRPC. La première partie de la réponse contient généralement un petit en-tête ; si elle dépasse la taille du tampon,…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_buffer_size size;` |
| **Valeur par défaut** | `grpc_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Définit la taille (*size*) du tampon utilisé pour lire la réponse reçue du serveur gRPC. La première partie de la réponse contient généralement un petit en-tête ; si elle dépasse la taille du tampon, la réponse est considérée comme non valide. La réponse est transmise au client de façon synchrone, dès sa réception. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme. Il peut toutefois être réduit.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
