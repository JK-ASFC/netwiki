---
title: "js_fetch_protocols (ngx_http_js_module)"
description: "Directive nginx js_fetch_protocols (ngx_http_js_module) — Active les protocoles indiqués pour les requêtes HTTPS de l'API Fetch."
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_protocols [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `js_fetch_protocols TLSv1 TLSv1.1 TLSv1.2;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Active les protocoles indiqués pour les requêtes HTTPS de l'[[10-guides/04-njs/reference|API Fetch]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
