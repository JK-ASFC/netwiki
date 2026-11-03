---
title: "db_ssl"
description: "Directive nginx db_ssl (ngx_http_db_module) — Enables TLS for connections to database servers. NOTE Server certificate verification is disabled by default. Verification is configured separately by db_ssl_verify."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl on \| off;` |
| **Valeur par défaut** | `db_ssl off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Enables TLS for connections to database servers.

> [!NOTE]
> Server certificate verification is disabled by default. Verification is configured separately by [[12-directives/db-ssl-verify|db_ssl_verify]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
