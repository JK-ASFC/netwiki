---
title: "uwsgi_modifier1"
description: "Directive nginx uwsgi_modifier1 (ngx_http_uwsgi_module) — Sets the value of the modifier1 field in the uwsgi packet header."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_modifier1 number;` |
| **Valeur par défaut** | `uwsgi_modifier1 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Sets the value of the `modifier1` field in the [uwsgi packet header](http://uwsgi-docs.readthedocs.org/en/latest/Protocol.html#uwsgi-packet-header).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
