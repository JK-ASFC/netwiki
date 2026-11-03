---
title: "uwsgi_ssl_verify_depth"
description: "Directive nginx uwsgi_ssl_verify_depth (ngx_http_uwsgi_module) — Définit la profondeur de vérification dans la chaîne de certificats du serveur uwsgi sécurisé."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_verify_depth number;` |
| **Valeur par défaut** | `uwsgi_ssl_verify_depth 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats du serveur uwsgi sécurisé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
