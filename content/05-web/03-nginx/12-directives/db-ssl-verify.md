---
title: "db_ssl_verify"
description: "Directive nginx db_ssl_verify (ngx_http_db_module) — Enables or disables verification of the database server certificate. The db_ssl_trusted_certificate directive must also be configured. The directive is required when db_ssl_verify is enabled."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_verify on \| off;` |
| **Valeur par défaut** | `db_ssl_verify off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Enables or disables verification of the database server certificate. The [[12-directives/db-ssl-trusted-certificate|db_ssl_trusted_certificate]] directive must also be configured. The directive is required when [[12-directives/db-ssl-verify|db_ssl_verify]] is enabled.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
