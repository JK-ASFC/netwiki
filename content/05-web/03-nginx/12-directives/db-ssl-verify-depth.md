---
title: "db_ssl_verify_depth"
description: "Directive nginx db_ssl_verify_depth (ngx_http_db_module) — Définit la profondeur de vérification dans la chaîne de certificats du serveur de base de données. Cette directive est obligatoire lorsque db_ssl_verify est activé."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_verify_depth number;` |
| **Valeur par défaut** | `db_ssl_verify_depth 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats du serveur de base de données. Cette directive est obligatoire lorsque [[12-directives/db-ssl-verify|db_ssl_verify]] est activé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
