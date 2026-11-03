---
title: "uwsgi_ssl_trusted_certificate"
description: "Directive nginx uwsgi_ssl_trusted_certificate (ngx_http_uwsgi_module) — Indique le fichier (file) contenant les certificats d'autorités de confiance au format PEM utilisé pour vérifier le certificat du serveur uwsgi sécurisé."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats d'autorités de confiance au format PEM utilisé pour [[12-directives/uwsgi-ssl-verify|vérifier]] le certificat du serveur uwsgi sécurisé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
