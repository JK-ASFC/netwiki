---
title: "health_check_timeout"
description: "Directive nginx health_check_timeout (ngx_stream_upstream_hc_module) — Overrides the proxy_timeout value for health checks."
tags: [nginx, directive, ngx_stream_upstream_hc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `health_check_timeout timeout;` |
| **Valeur par défaut** | `health_check_timeout 5s;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_hc_module\|ngx_stream_upstream_hc_module]] |

## Utilisation

Overrides the [[12-directives/proxy-timeout-stream-proxy|proxy_timeout]] value for health checks.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
