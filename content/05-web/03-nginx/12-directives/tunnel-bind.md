---
title: "tunnel_bind"
description: "Directive nginx tunnel_bind (ngx_http_tunnel_module) — Fait partir les connexions sortantes vers un serveur d'arrière-plan de l'adresse IP locale indiquée, avec un port facultatif. La valeur du paramètre peut contenir des variables. La valeur spéciale…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_bind address \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Fait partir les connexions sortantes vers un serveur d'arrière-plan de l'adresse IP locale indiquée, avec un port facultatif. La valeur du paramètre peut contenir des variables. La valeur spéciale `off` annule l'effet de la directive `tunnel_bind` héritée du niveau de configuration précédent, ce qui laisse le système choisir l'adresse IP et le port locaux.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
