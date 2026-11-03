---
title: "limit_conn_dry_run (ngx_stream_limit_conn_module)"
description: "Directive nginx limit_conn_dry_run (ngx_stream_limit_conn_module) — Active le mode d'essai à blanc (dry run). Dans ce mode, le nombre de connexions n'est pas limité, mais le nombre de connexions excédentaires est comptabilisé normalement dans la zone de mémoire…"
tags: [nginx, directive, ngx_stream_limit_conn_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn_dry_run on \| off;` |
| **Valeur par défaut** | `limit_conn_dry_run off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.17.6 |
| **Module** | [[11-modules/03-stream/ngx_stream_limit_conn_module\|ngx_stream_limit_conn_module]] |

## Utilisation

Active le mode d'essai à blanc (*dry run*). Dans ce mode, le nombre de connexions n'est pas limité, mais le nombre de connexions excédentaires est comptabilisé normalement dans la zone de mémoire partagée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
