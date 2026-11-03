---
title: "uwsgi_ssl_server_name"
description: "Directive nginx uwsgi_ssl_server_name (ngx_http_uwsgi_module) — Active ou désactive la transmission du nom de serveur via l'extension TLS Server Name Indication (SNI, RFC 6066) lors de l'établissement de la connexion avec le serveur uwsgi sécurisé."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_server_name on \| off;` |
| **Valeur par défaut** | `uwsgi_ssl_server_name off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Active ou désactive la transmission du nom de serveur via l'[extension TLS Server Name Indication](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066) lors de l'établissement de la connexion avec le serveur uwsgi sécurisé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
