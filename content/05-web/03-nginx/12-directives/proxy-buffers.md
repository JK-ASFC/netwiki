---
title: "proxy_buffers"
description: "Directive nginx proxy_buffers (ngx_http_proxy_module) — Définit le nombre (number) et la taille (size) des tampons utilisés pour lire une réponse du serveur mandaté, pour une connexion. Par défaut, un tampon fait une page mémoire, soit 4K ou 8K selon la…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_buffers number size;` |
| **Valeur par défaut** | `proxy_buffers 8 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit le nombre (*number*) et la taille (*size*) des tampons utilisés pour lire une réponse du serveur mandaté, pour une connexion. Par défaut, un tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
