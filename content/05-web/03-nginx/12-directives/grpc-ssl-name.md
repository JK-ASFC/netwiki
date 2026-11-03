---
title: "grpc_ssl_name"
description: "Directive nginx grpc_ssl_name (ngx_http_grpc_module) — Permet de remplacer le nom de serveur utilisé pour vérifier le certificat du serveur gRPC SSL et transmis via SNI lors de l'établissement de la connexion avec ce serveur. Par défaut, la partie hôte…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_name name;` |
| **Valeur par défaut** | `grpc_ssl_name host from grpc_pass;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Permet de remplacer le nom de serveur utilisé pour [[12-directives/grpc-ssl-verify|vérifier]] le certificat du serveur gRPC SSL et [[12-directives/grpc-ssl-server-name|transmis via SNI]] lors de l'établissement de la connexion avec ce serveur.

Par défaut, la partie hôte de [[12-directives/grpc-pass|grpc_pass]] est utilisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
