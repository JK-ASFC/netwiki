---
title: "db_ssl_ciphers"
description: "Directive nginx db_ssl_ciphers (ngx_http_db_module) — Indique les suites de chiffrement activées pour les connexions aux serveurs de base de données, au format reconnu par la bibliothèque OpenSSL."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `db_ssl_ciphers DEFAULT;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique les suites de chiffrement activées pour les connexions aux serveurs de base de données, au format reconnu par la bibliothèque OpenSSL.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
