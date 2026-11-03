---
title: "db_ssl_certificate_key"
description: "Directive nginx db_ssl_certificate_key (ngx_http_db_module) — Indique le fichier (file) contenant la clé secrète au format PEM du certificat défini par la directive db_ssl_certificate. La valeur du paramètre peut contenir des variables : nginx…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique le fichier (*file*) contenant la clé secrète au format PEM du certificat défini par la directive [[12-directives/db-ssl-certificate|db_ssl_certificate]].

La valeur du paramètre peut contenir des variables :

```nginx
db_ssl_certificate_key /etc/nginx/client-certs/$host.key;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
