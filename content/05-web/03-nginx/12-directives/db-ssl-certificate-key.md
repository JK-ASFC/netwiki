---
title: "db_ssl_certificate_key"
description: "Directive nginx db_ssl_certificate_key (ngx_http_db_module) — Specifies a file with the secret key in the PEM format for the certificate configured by the db_ssl_certificate directive. The parameter value can contain variables: nginx db_ssl_certificate_key…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Specifies a *file* with the secret key in the PEM format for the certificate configured by the [[12-directives/db-ssl-certificate|db_ssl_certificate]] directive.

The parameter value can contain variables:

```nginx
db_ssl_certificate_key /etc/nginx/client-certs/$host.key;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
