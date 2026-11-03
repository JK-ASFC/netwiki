---
title: "grpc_buffer_size"
description: "Directive nginx grpc_buffer_size (ngx_http_grpc_module) — Sets the size of the buffer used for reading the response received from the gRPC server. The first part of the response usually contains a small header; if it exceeds the buffer size, the response is…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_buffer_size size;` |
| **Valeur par défaut** | `grpc_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Sets the *size* of the buffer used for reading the response received from the gRPC server. The first part of the response usually contains a small header; if it exceeds the buffer size, the response is considered invalid. The response is passed to the client synchronously, as soon as it is received. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform. It can be made smaller, however.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
