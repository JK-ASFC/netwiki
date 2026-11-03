---
title: "uwsgi_ssl_name"
description: "Directive nginx uwsgi_ssl_name (ngx_http_uwsgi_module) — Permet de remplacer le nom de serveur utilisé pour vérifier le certificat du serveur uwsgi sécurisé et transmis via SNI lors de l'établissement de la connexion avec ce serveur. Par défaut, la partie…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_name name;` |
| **Valeur par défaut** | `uwsgi_ssl_name host from uwsgi_pass;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Permet de remplacer le nom de serveur utilisé pour [[12-directives/uwsgi-ssl-verify|vérifier]] le certificat du serveur uwsgi sécurisé et [[12-directives/uwsgi-ssl-server-name|transmis via SNI]] lors de l'établissement de la connexion avec ce serveur.

Par défaut, la partie hôte de [[12-directives/uwsgi-pass|uwsgi_pass]] est utilisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
