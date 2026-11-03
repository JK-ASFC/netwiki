---
title: "uwsgi_modifier2"
description: "Directive nginx uwsgi_modifier2 (ngx_http_uwsgi_module) — Définit la valeur du champ modifier2 de l'en-tête de paquet uwsgi."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_modifier2 number;` |
| **Valeur par défaut** | `uwsgi_modifier2 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit la valeur du champ `modifier2` de l'[en-tête de paquet uwsgi](http://uwsgi-docs.readthedocs.org/en/latest/Protocol.html#uwsgi-packet-header).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
