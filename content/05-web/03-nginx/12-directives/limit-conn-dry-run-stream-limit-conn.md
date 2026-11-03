---
title: "limit_conn_dry_run (ngx_stream_limit_conn_module)"
description: "Directive nginx limit_conn_dry_run (ngx_stream_limit_conn_module) — Enables the dry run mode. In this mode, the number of connections is not limited, however, in the shared memory zone, the number of excessive connections is accounted as usual."
tags: [nginx, directive, ngx_stream_limit_conn_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn_dry_run on \| off;` |
| **Valeur par défaut** | `limit_conn_dry_run off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.17.6 |
| **Module** | [[11-modules/03-stream/ngx_stream_limit_conn_module\|ngx_stream_limit_conn_module]] |

## Utilisation

Enables the dry run mode. In this mode, the number of connections is not limited, however, in the shared memory zone, the number of excessive connections is accounted as usual.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
