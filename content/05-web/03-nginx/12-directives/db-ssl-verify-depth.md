---
title: "db_ssl_verify_depth"
description: "Directive nginx db_ssl_verify_depth (ngx_http_db_module) — Sets the verification depth in the database server certificate chain. The directive is required when db_ssl_verify is enabled."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_verify_depth number;` |
| **Valeur par défaut** | `db_ssl_verify_depth 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Sets the verification depth in the database server certificate chain. The directive is required when [[12-directives/db-ssl-verify|db_ssl_verify]] is enabled.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
