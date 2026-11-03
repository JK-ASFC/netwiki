---
title: "tunnel_read_timeout"
description: "Directive nginx tunnel_read_timeout (ngx_http_tunnel_module) — Définit le délai entre deux opérations de lecture ou d'écriture successives sur les connexions du client ou du serveur d'arrière-plan. Si aucune donnée n'est transmise pendant ce délai, la connexion…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_read_timeout time;` |
| **Valeur par défaut** | `tunnel_read_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Définit le délai entre deux opérations de lecture ou d'écriture successives sur les connexions du client ou du serveur d'arrière-plan. Si aucune donnée n'est transmise pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
