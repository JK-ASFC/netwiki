---
title: "health_check_timeout"
description: "Directive nginx health_check_timeout (ngx_stream_upstream_hc_module) — Remplace la valeur de proxy_timeout pour les vérifications de santé."
tags: [nginx, directive, ngx_stream_upstream_hc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `health_check_timeout timeout;` |
| **Valeur par défaut** | `health_check_timeout 5s;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_hc_module\|ngx_stream_upstream_hc_module]] |

## Utilisation

Remplace la valeur de [[12-directives/proxy-timeout-stream-proxy|proxy_timeout]] pour les vérifications de santé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
