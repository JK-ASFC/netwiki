---
title: "js_fetch_keepalive_requests (ngx_http_js_module)"
description: "Directive nginx js_fetch_keepalive_requests (ngx_http_js_module) — Définit le nombre maximal de requêtes pouvant être servies sur une connexion persistante avec l'API Fetch. Une fois ce nombre atteint, la connexion est fermée. Fermer périodiquement les connexions…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive_requests number;` |
| **Valeur par défaut** | `js_fetch_keepalive_requests 1000;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit le nombre maximal de requêtes pouvant être servies sur une connexion persistante avec l'[[10-guides/04-njs/reference|API Fetch]]. Une fois ce nombre atteint, la connexion est fermée.

Fermer périodiquement les connexions est nécessaire pour libérer la mémoire allouée par connexion. Un nombre maximal de requêtes trop élevé peut donc entraîner une consommation de mémoire excessive et n'est pas recommandé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
