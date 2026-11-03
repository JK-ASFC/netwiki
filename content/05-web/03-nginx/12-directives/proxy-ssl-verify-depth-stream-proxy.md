---
title: "proxy_ssl_verify_depth (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_verify_depth (ngx_stream_proxy_module) — Définit la profondeur de vérification dans la chaîne de certificats du serveur mandaté."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_verify_depth number;` |
| **Valeur par défaut** | `proxy_ssl_verify_depth 1;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats du serveur mandaté.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
