---
title: "proxy_protocol_timeout"
description: "Directive nginx proxy_protocol_timeout (ngx_stream_core_module) — Définit le délai de lecture complète de l'en-tête du protocole PROXY. Si l'en-tête entier n'est pas transmis dans ce délai, la connexion est fermée."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_protocol_timeout timeout;` |
| **Valeur par défaut** | `proxy_protocol_timeout 30s;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit le *délai* de lecture complète de l'en-tête du protocole PROXY. Si l'en-tête entier n'est pas transmis dans ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
