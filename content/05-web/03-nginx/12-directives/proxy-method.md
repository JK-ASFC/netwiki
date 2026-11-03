---
title: "proxy_method"
description: "Directive nginx proxy_method (ngx_http_proxy_module) — Indique la méthode (method) HTTP à utiliser dans les requêtes transmises au serveur mandaté, à la place de celle de la requête du client. La valeur du paramètre peut contenir des variables (1.11.6)."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_method method;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indique la méthode (*method*) HTTP à utiliser dans les requêtes transmises au serveur mandaté, à la place de celle de la requête du client. La valeur du paramètre peut contenir des variables (1.11.6).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
