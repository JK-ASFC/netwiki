---
title: "sendfile_max_chunk"
description: "Directive nginx sendfile_max_chunk (ngx_http_core_module) — Limits the amount of data that can be transferred in a single sendfile call. Without the limit, one fast connection may seize the worker process entirely. NOTE Prior to version 1.21.4, by default…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sendfile_max_chunk size;` |
| **Valeur par défaut** | `sendfile_max_chunk 2m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Limits the amount of data that can be transferred in a single `sendfile` call. Without the limit, one fast connection may seize the worker process entirely.

> [!NOTE]
> Prior to version 1.21.4, by default there was no limit.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
