---
title: "db_ssl_password_file"
description: "Directive nginx db_ssl_password_file (ngx_http_db_module) — Indique un fichier (file) de phrases de passe pour les clés secrètes, une phrase par ligne. Les phrases sont essayées tour à tour au chargement de la clé."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_password_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique un fichier (*file*) de phrases de passe pour les [[12-directives/db-ssl-certificate-key|clés secrètes]], une phrase par ligne. Les phrases sont essayées tour à tour au chargement de la clé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
