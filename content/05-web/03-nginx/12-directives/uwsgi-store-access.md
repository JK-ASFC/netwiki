---
title: "uwsgi_store_access"
description: "Directive nginx uwsgi_store_access (ngx_http_uwsgi_module) — Définit les droits d'accès des fichiers et répertoires nouvellement créés, par exemple : nginx uwsgi_store_access user:rw group:rw all:r; Si des droits group ou all sont indiqués, les droits user…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_store_access users:permissions ...;` |
| **Valeur par défaut** | `uwsgi_store_access user:rw;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit les droits d'accès des fichiers et répertoires nouvellement créés, par exemple :

```nginx
uwsgi_store_access user:rw group:rw all:r;
```

Si des droits `group` ou `all` sont indiqués, les droits `user` peuvent être omis :

```nginx
uwsgi_store_access group:rw all:r;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
