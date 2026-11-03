---
title: "uwsgi_ignore_client_abort"
description: "Directive nginx uwsgi_ignore_client_abort (ngx_http_uwsgi_module) — Indique si la connexion avec un serveur uwsgi doit être fermée lorsque le client ferme la connexion sans attendre la réponse."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ignore_client_abort on \| off;` |
| **Valeur par défaut** | `uwsgi_ignore_client_abort off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indique si la connexion avec un serveur uwsgi doit être fermée lorsque le client ferme la connexion sans attendre la réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
