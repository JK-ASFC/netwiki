---
title: "grpc_ignore_headers"
description: "Directive nginx grpc_ignore_headers (ngx_http_grpc_module) — Désactive le traitement de certains champs d'en-tête de réponse du serveur gRPC. Les champs suivants peuvent être ignorés : X-Accel-Redirect et X-Accel-Charset. S'il n'est pas désactivé, le…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ignore_headers field ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Désactive le traitement de certains champs d'en-tête de réponse du serveur gRPC. Les champs suivants peuvent être ignorés : `X-Accel-Redirect` et `X-Accel-Charset`.

S'il n'est pas désactivé, le traitement de ces champs a l'effet suivant :

- `X-Accel-Redirect` effectue une [[12-directives/internal|redirection interne]] vers l'URI indiqué ;

- `X-Accel-Charset` définit le [[12-directives/charset|jeu de caractères]] souhaité pour la réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
