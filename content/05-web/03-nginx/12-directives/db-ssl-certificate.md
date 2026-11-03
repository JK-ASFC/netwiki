---
title: "db_ssl_certificate"
description: "Directive nginx db_ssl_certificate (ngx_http_db_module) — Indique le fichier (file) contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur de base de données. La directive db_ssl_certificate_key correspondante doit aussi être…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique le fichier (*file*) contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur de base de données. La directive [[12-directives/db-ssl-certificate-key|db_ssl_certificate_key]] correspondante doit aussi être configurée.

La valeur du paramètre peut contenir des variables :

```nginx
db_ssl_certificate /etc/nginx/client-certs/$host.crt;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
