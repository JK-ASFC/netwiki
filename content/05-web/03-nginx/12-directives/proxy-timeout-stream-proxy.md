---
title: "proxy_timeout (ngx_stream_proxy_module)"
description: "Directive nginx proxy_timeout (ngx_stream_proxy_module) — Définit le délai (timeout) entre deux opérations de lecture ou d'écriture successives sur les connexions du client ou du serveur mandaté. Si aucune donnée n'est transmise pendant ce délai, la…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_timeout timeout;` |
| **Valeur par défaut** | `proxy_timeout 10m;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Définit le délai (*timeout*) entre deux opérations de lecture ou d'écriture successives sur les connexions du client ou du serveur mandaté. Si aucune donnée n'est transmise pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
