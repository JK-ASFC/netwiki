---
title: "db_ssl"
description: "Directive nginx db_ssl (ngx_http_db_module) — Active TLS pour les connexions aux serveurs de base de données. NOTE La vérification du certificat du serveur est désactivée par défaut ; elle se configure séparément avec db_ssl_verify."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl on \| off;` |
| **Valeur par défaut** | `db_ssl off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Active TLS pour les connexions aux serveurs de base de données.

> [!NOTE]
> La vérification du certificat du serveur est désactivée par défaut ; elle se configure séparément avec [[12-directives/db-ssl-verify|db_ssl_verify]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
