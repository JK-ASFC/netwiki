---
title: "fastcgi_buffers"
description: "Directive nginx fastcgi_buffers (ngx_http_fastcgi_module) — Définit le nombre (number) et la taille (size) des tampons utilisés pour lire une réponse du serveur FastCGI, pour une connexion. Par défaut, un tampon fait une page mémoire, soit 4K ou 8K selon la…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_buffers number size;` |
| **Valeur par défaut** | `fastcgi_buffers 8 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit le nombre (*number*) et la taille (*size*) des tampons utilisés pour lire une réponse du serveur FastCGI, pour une connexion. Par défaut, un tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
