---
title: "tunnel_connect_timeout"
description: "Directive nginx tunnel_connect_timeout (ngx_http_tunnel_module) — Définit le délai d'établissement de la connexion avec un serveur d'arrière-plan. Ce délai ne peut généralement pas dépasser 75 secondes."
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_connect_timeout time;` |
| **Valeur par défaut** | `tunnel_connect_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Définit le délai d'établissement de la connexion avec un serveur d'arrière-plan. Ce délai ne peut généralement pas dépasser 75 secondes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
