---
title: "grpc_socket_rcvbuf"
description: "Directive nginx grpc_socket_rcvbuf (ngx_http_grpc_module) — Définit la taille du tampon de réception (option SO_RCVBUF) des connexions sortantes vers un serveur gRPC. La valeur spéciale 0 annule l'effet de la directive grpc_socket_rcvbuf héritée du niveau de…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_socket_rcvbuf size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Définit la taille du tampon de réception (option `SO_RCVBUF`) des connexions sortantes vers un serveur gRPC. La valeur spéciale `0` annule l'effet de la directive `grpc_socket_rcvbuf` héritée du niveau de configuration précédent, ce qui laisse s'appliquer les réglages du système d'exploitation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
