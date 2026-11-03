---
title: "grpc_next_upstream_tries"
description: "Directive nginx grpc_next_upstream_tries (ngx_http_grpc_module) — Limits the number of possible tries for passing a request to the next server. The 0 value turns off this limitation."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_next_upstream_tries number;` |
| **Valeur par défaut** | `grpc_next_upstream_tries 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Limits the number of possible tries for passing a request to the [[12-directives/grpc-next-upstream|next server]]. The `0` value turns off this limitation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
