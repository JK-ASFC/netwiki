---
title: "grpc_read_timeout"
description: "Directive nginx grpc_read_timeout (ngx_http_grpc_module) — Définit le délai de lecture d'une réponse du serveur gRPC. Ce délai porte uniquement sur l'intervalle entre deux lectures successives, pas sur la transmission de toute la réponse. Si le serveur gRPC…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_read_timeout time;` |
| **Valeur par défaut** | `grpc_read_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Définit le délai de lecture d'une réponse du serveur gRPC. Ce délai porte uniquement sur l'intervalle entre deux lectures successives, pas sur la transmission de toute la réponse. Si le serveur gRPC n'envoie rien pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
