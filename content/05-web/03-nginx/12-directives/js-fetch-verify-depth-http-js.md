---
title: "js_fetch_verify_depth (ngx_http_js_module)"
description: "Directive nginx js_fetch_verify_depth (ngx_http_js_module) — Définit la profondeur de vérification dans la chaîne de certificats du serveur HTTPS avec l'API Fetch."
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_verify_depth number;` |
| **Valeur par défaut** | `js_fetch_verify_depth 100;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats du serveur HTTPS avec l'[[10-guides/04-njs/reference|API Fetch]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
