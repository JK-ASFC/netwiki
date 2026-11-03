---
title: "aio_write"
description: "Directive nginx aio_write (ngx_http_core_module) — Si aio est activé, indique s'il est utilisé pour écrire des fichiers. Actuellement, cela ne fonctionne qu'avec aio threads et se limite à l'écriture des fichiers temporaires contenant des données…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `aio_write on \| off;` |
| **Valeur par défaut** | `aio_write off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.9.13 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Si [[12-directives/aio|aio]] est activé, indique s'il est utilisé pour écrire des fichiers. Actuellement, cela ne fonctionne qu'avec `aio threads` et se limite à l'écriture des fichiers temporaires contenant des données reçues des serveurs mandatés.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
