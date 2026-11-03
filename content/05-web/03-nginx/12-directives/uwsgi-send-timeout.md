---
title: "uwsgi_send_timeout"
description: "Directive nginx uwsgi_send_timeout (ngx_http_uwsgi_module) — Définit le délai de transmission d'une requête au serveur uwsgi. Ce délai porte uniquement sur l'intervalle entre deux écritures successives, pas sur la transmission de toute la requête. Si le…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_send_timeout time;` |
| **Valeur par défaut** | `uwsgi_send_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit le délai de transmission d'une requête au serveur uwsgi. Ce délai porte uniquement sur l'intervalle entre deux écritures successives, pas sur la transmission de toute la requête. Si le serveur uwsgi ne reçoit rien pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
