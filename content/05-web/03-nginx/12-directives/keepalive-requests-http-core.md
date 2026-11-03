---
title: "keepalive_requests (ngx_http_core_module)"
description: "Directive nginx keepalive_requests (ngx_http_core_module) — Sets the maximum number of requests that can be served through one keep-alive connection. After the maximum number of requests are made, the connection is closed. Closing connections periodically is…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_requests number;` |
| **Valeur par défaut** | `keepalive_requests 1000;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.0 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the maximum number of requests that can be served through one keep-alive connection. After the maximum number of requests are made, the connection is closed.

Closing connections periodically is necessary to free per-connection memory allocations. Therefore, using too high maximum number of requests could result in excessive memory usage and not recommended.

> [!NOTE]
> Prior to version 1.19.10, the default value was 100.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
