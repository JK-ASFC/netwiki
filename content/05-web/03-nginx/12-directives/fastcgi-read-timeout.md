---
title: "fastcgi_read_timeout"
description: "Directive nginx fastcgi_read_timeout (ngx_http_fastcgi_module) — Définit le délai de lecture d'une réponse du serveur FastCGI. Ce délai porte uniquement sur l'intervalle entre deux lectures successives, pas sur la transmission de toute la réponse. Si le serveur…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_read_timeout time;` |
| **Valeur par défaut** | `fastcgi_read_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit le délai de lecture d'une réponse du serveur FastCGI. Ce délai porte uniquement sur l'intervalle entre deux lectures successives, pas sur la transmission de toute la réponse. Si le serveur FastCGI n'envoie rien pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
