---
title: "chunked_transfer_encoding"
description: "Directive nginx chunked_transfer_encoding (ngx_http_core_module) — Permet de désactiver l'encodage de transfert par morceaux (chunked) en HTTP/1.1. Utile avec un logiciel qui ne prend pas en charge cet encodage malgré l'exigence de la norme."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `chunked_transfer_encoding on \| off;` |
| **Valeur par défaut** | `chunked_transfer_encoding on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Permet de désactiver l'encodage de transfert par morceaux (*chunked*) en HTTP/1.1. Utile avec un logiciel qui ne prend pas en charge cet encodage malgré l'exigence de la norme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
