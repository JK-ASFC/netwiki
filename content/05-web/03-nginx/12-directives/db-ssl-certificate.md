---
title: "db_ssl_certificate"
description: "Directive nginx db_ssl_certificate (ngx_http_db_module) — Specifies a file with the certificate in the PEM format used for authentication to a database server. The corresponding db_ssl_certificate_key must also be configured. The parameter value can contain…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Specifies a *file* with the certificate in the PEM format used for authentication to a database server. The corresponding [[12-directives/db-ssl-certificate-key|db_ssl_certificate_key]] must also be configured.

The parameter value can contain variables:

```nginx
db_ssl_certificate /etc/nginx/client-certs/$host.crt;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
