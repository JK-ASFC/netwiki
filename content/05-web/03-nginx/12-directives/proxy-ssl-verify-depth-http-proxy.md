---
title: "proxy_ssl_verify_depth (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_verify_depth (ngx_http_proxy_module) — Définit la profondeur de vérification dans la chaîne de certificats du serveur HTTPS mandaté."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_verify_depth number;` |
| **Valeur par défaut** | `proxy_ssl_verify_depth 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats du serveur HTTPS mandaté.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
