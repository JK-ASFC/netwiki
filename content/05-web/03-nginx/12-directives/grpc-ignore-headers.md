---
title: "grpc_ignore_headers"
description: "Directive nginx grpc_ignore_headers (ngx_http_grpc_module) — Disables processing of certain response header fields from the gRPC server. The following fields can be ignored: X-Accel-Redirect and X-Accel-Charset. S'il n'est pas désactivé, le traitement de ces…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ignore_headers field ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Disables processing of certain response header fields from the gRPC server. The following fields can be ignored: `X-Accel-Redirect` and `X-Accel-Charset`.

S'il n'est pas désactivé, le traitement de ces champs a l'effet suivant :

- `X-Accel-Redirect` effectue une [[12-directives/internal|redirection interne]] vers l'URI indiqué ;

- `X-Accel-Charset` définit le [[12-directives/charset|jeu de caractères]] souhaité pour la réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
