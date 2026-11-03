---
title: "uwsgi_buffer_size"
description: "Directive nginx uwsgi_buffer_size (ngx_http_uwsgi_module) — Définit la taille (size) du tampon utilisé pour lire la première partie de la réponse reçue du serveur uwsgi. Cette partie contient généralement un petit en-tête de réponse ; si elle dépasse la…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_buffer_size size;` |
| **Valeur par défaut** | `uwsgi_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit la taille (*size*) du tampon utilisé pour lire la première partie de la réponse reçue du serveur uwsgi. Cette partie contient généralement un petit en-tête de réponse ; si elle dépasse la taille du tampon, la réponse est considérée comme non valide. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme. Il peut toutefois être réduit.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
