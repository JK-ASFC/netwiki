---
title: "allow (ngx_stream_access_module)"
description: "Directive nginx allow (ngx_stream_access_module) — Autorise l'accès pour le réseau ou l'adresse indiqués. Avec la valeur spéciale unix:, autorise l'accès pour toutes les sockets de domaine UNIX."
tags: [nginx, directive, ngx_stream_access_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `allow address \| CIDR \| unix: \| all;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_access_module\|ngx_stream_access_module]] |

## Utilisation

Autorise l'accès pour le réseau ou l'adresse indiqués. Avec la valeur spéciale `unix:`, autorise l'accès pour toutes les sockets de domaine UNIX.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
