---
title: "db_ssl_name"
description: "Directive nginx db_ssl_name (ngx_http_db_module) — Permet de remplacer le nom de serveur utilisé pour vérifier le certificat du serveur de base de données et transmis via SNI lors de l'établissement de la connexion."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_name name;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Permet de remplacer le nom de serveur utilisé pour [[12-directives/db-ssl-verify|vérifier]] le certificat du serveur de base de données et [[12-directives/db-ssl-server-name|transmis via SNI]] lors de l'établissement de la connexion.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
