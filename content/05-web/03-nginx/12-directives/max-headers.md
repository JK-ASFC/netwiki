---
title: "max_headers"
description: "Directive nginx max_headers (ngx_http_core_module) — Définit le nombre maximal de lignes d'en-tête autorisées dans les requêtes. Si cette limite est atteinte, l'erreur 400 Bad Request est renvoyée."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `max_headers number;` |
| **Valeur par défaut** | `max_headers 1000;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.29.8 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le nombre maximal de lignes d'en-tête autorisées dans les requêtes. Si cette limite est atteinte, l'erreur `400 Bad Request` est renvoyée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
