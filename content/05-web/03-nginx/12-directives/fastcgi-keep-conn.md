---
title: "fastcgi_keep_conn"
description: "Directive nginx fastcgi_keep_conn (ngx_http_fastcgi_module) — Par défaut, un serveur FastCGI ferme la connexion juste après avoir envoyé la réponse. Avec la valeur on, nginx demande au serveur FastCGI de garder les connexions ouvertes. C'est notamment…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_keep_conn on \| off;` |
| **Valeur par défaut** | `fastcgi_keep_conn off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.4 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Par défaut, un serveur FastCGI ferme la connexion juste après avoir envoyé la réponse. Avec la valeur `on`, nginx demande au serveur FastCGI de garder les connexions ouvertes. C'est notamment nécessaire au fonctionnement des connexions [[12-directives/keepalive|persistantes]] vers les serveurs FastCGI.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
