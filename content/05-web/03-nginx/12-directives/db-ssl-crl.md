---
title: "db_ssl_crl"
description: "Directive nginx db_ssl_crl (ngx_http_db_module) — Indique le fichier (file) contenant les certificats révoqués (CRL) au format PEM utilisé pour vérifier le certificat du serveur de base de données. Avec des certificats intermédiaires, leurs CRL…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats révoqués (CRL) au format PEM utilisé pour [[12-directives/db-ssl-verify|vérifier]] le certificat du serveur de base de données. Avec des certificats intermédiaires, leurs CRL doivent figurer dans le même fichier.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
