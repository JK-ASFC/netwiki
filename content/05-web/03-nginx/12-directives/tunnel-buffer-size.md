---
title: "tunnel_buffer_size"
description: "Directive nginx tunnel_buffer_size (ngx_http_tunnel_module) — Définit la taille (size) du tampon utilisé pour lire les données du serveur d'arrière-plan, ainsi que celle du tampon de lecture des données du client."
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_buffer_size size;` |
| **Valeur par défaut** | `tunnel_buffer_size 16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Définit la taille (*size*) du tampon utilisé pour lire les données du serveur d'arrière-plan, ainsi que celle du tampon de lecture des données du client.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
