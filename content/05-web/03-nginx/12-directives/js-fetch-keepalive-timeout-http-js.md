---
title: "js_fetch_keepalive_timeout (ngx_http_js_module)"
description: "Directive nginx js_fetch_keepalive_timeout (ngx_http_js_module) — Définit le délai pendant lequel une connexion persistante inactive vers un serveur de destination reste ouverte avec l'API Fetch."
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive_timeout time;` |
| **Valeur par défaut** | `js_fetch_keepalive_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit le délai pendant lequel une connexion persistante inactive vers un serveur de destination reste ouverte avec l'[[10-guides/04-njs/reference|API Fetch]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
