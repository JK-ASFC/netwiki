---
title: "uwsgi_ssl_certificate_key"
description: "Directive nginx uwsgi_ssl_certificate_key (ngx_http_uwsgi_module) — Indique le fichier (file) contenant la clé secrète au format PEM utilisée pour s'authentifier auprès d'un serveur uwsgi sécurisé. On peut indiquer engine:name:id à la place de file (1.7.9) pour…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.8 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indique le fichier (*file*) contenant la clé secrète au format PEM utilisée pour s'authentifier auprès d'un serveur uwsgi sécurisé.

On peut indiquer `engine`:*name*:*id* à la place de *file* (1.7.9) pour charger la clé secrète d'identifiant *id* depuis le moteur OpenSSL *name*.

On peut indiquer `store`:*scheme*:*id* à la place de *file* (1.29.0) pour charger la clé secrète d'identifiant *id* via le schéma d'URI *scheme* enregistré par un fournisseur OpenSSL, par exemple [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

Depuis la version 1.21.0, le nom de fichier (*file*) peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
