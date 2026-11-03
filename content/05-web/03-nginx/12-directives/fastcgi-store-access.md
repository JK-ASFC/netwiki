---
title: "fastcgi_store_access"
description: "Directive nginx fastcgi_store_access (ngx_http_fastcgi_module) — Définit les droits d'accès des fichiers et répertoires nouvellement créés, par exemple : nginx fastcgi_store_access user:rw group:rw all:r; Si des droits group ou all sont indiqués, les droits user…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_store_access users:permissions ...;` |
| **Valeur par défaut** | `fastcgi_store_access user:rw;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit les droits d'accès des fichiers et répertoires nouvellement créés, par exemple :

```nginx
fastcgi_store_access user:rw group:rw all:r;
```

Si des droits `group` ou `all` sont indiqués, les droits `user` peuvent être omis :

```nginx
fastcgi_store_access group:rw all:r;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
