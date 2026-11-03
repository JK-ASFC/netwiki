---
title: "tcp_nodelay (ngx_stream_core_module)"
description: "Directive nginx tcp_nodelay (ngx_stream_core_module) — Active ou désactive l'option TCP_NODELAY. L'option est activée pour les connexions client comme pour celles vers le serveur mandaté."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tcp_nodelay on \| off;` |
| **Valeur par défaut** | `tcp_nodelay on;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Active ou désactive l'option `TCP_NODELAY`. L'option est activée pour les connexions client comme pour celles vers le serveur mandaté.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
