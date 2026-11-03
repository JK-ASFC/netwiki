---
title: "deny (ngx_stream_access_module)"
description: "Directive nginx deny (ngx_stream_access_module) — Refuse l'accès pour le réseau ou l'adresse indiqués. Avec la valeur spéciale unix:, refuse l'accès pour toutes les sockets de domaine UNIX."
tags: [nginx, directive, ngx_stream_access_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `deny address \| CIDR \| unix: \| all;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_access_module\|ngx_stream_access_module]] |

## Utilisation

Refuse l'accès pour le réseau ou l'adresse indiqués. Avec la valeur spéciale `unix:`, refuse l'accès pour toutes les sockets de domaine UNIX.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
