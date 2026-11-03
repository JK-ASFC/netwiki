---
title: "uwsgi_modifier1"
description: "Directive nginx uwsgi_modifier1 (ngx_http_uwsgi_module) — Définit la valeur du champ modifier1 de l'en-tête de paquet uwsgi."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_modifier1 number;` |
| **Valeur par défaut** | `uwsgi_modifier1 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit la valeur du champ `modifier1` de l'[en-tête de paquet uwsgi](http://uwsgi-docs.readthedocs.org/en/latest/Protocol.html#uwsgi-packet-header).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
