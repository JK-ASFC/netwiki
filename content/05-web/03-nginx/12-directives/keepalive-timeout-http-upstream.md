---
title: "keepalive_timeout (ngx_http_upstream_module)"
description: "Directive nginx keepalive_timeout (ngx_http_upstream_module) — Définit le délai pendant lequel une connexion persistante inactive vers un serveur amont reste ouverte."
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_timeout timeout;` |
| **Valeur par défaut** | `keepalive_timeout 60s;` |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.15.3 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Définit le délai pendant lequel une connexion persistante inactive vers un serveur amont reste ouverte.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
