---
title: "db_ssl_verify"
description: "Directive nginx db_ssl_verify (ngx_http_db_module) — Active ou désactive la vérification du certificat du serveur de base de données. La directive db_ssl_trusted_certificate doit aussi être configurée ; elle est obligatoire lorsque db_ssl_verify est…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_verify on \| off;` |
| **Valeur par défaut** | `db_ssl_verify off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Active ou désactive la vérification du certificat du serveur de base de données. La directive [[12-directives/db-ssl-trusted-certificate|db_ssl_trusted_certificate]] doit aussi être configurée ; elle est obligatoire lorsque [[12-directives/db-ssl-verify|db_ssl_verify]] est activé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
