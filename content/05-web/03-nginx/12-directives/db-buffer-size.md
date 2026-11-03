---
title: "db_buffer_size"
description: "Directive nginx db_buffer_size (ngx_http_db_module) — Définit la taille du tampon utilisé pour lire la réponse de la base de données. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme. Il peut toutefois être réduit. Le…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_buffer_size size;` |
| **Valeur par défaut** | `db_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Définit la taille du tampon utilisé pour lire la réponse de la base de données. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme. Il peut toutefois être réduit.

Le tampon sert aussi à analyser les réponses du protocole de la base. Un en-tête de réponse qui ne tient pas dans le tampon ne peut pas être traité.

Le corps des réponses de la base est traité sans mise en tampon des réponses amont.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
