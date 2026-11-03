---
title: "uwsgi_pass_request_headers"
description: "Directive nginx uwsgi_pass_request_headers (ngx_http_uwsgi_module) — Indique si les champs d'en-tête de la requête d'origine sont transmis au serveur uwsgi. Voir aussi la directive uwsgi_pass_request_body."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_pass_request_headers on \| off;` |
| **Valeur par défaut** | `uwsgi_pass_request_headers on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indique si les champs d'en-tête de la requête d'origine sont transmis au serveur uwsgi. Voir aussi la directive [[12-directives/uwsgi-pass-request-body|uwsgi_pass_request_body]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
