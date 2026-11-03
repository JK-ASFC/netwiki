---
title: "keepalive_min_timeout"
description: "Directive nginx keepalive_min_timeout (ngx_http_core_module) — Sets a timeout during which a keep-alive client connection will not be closed on the server side for connection reuse or on graceful shutdown of worker processes."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_min_timeout timeout;` |
| **Valeur par défaut** | `keepalive_min_timeout 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets a timeout during which a keep-alive client connection will not be closed on the server side for connection reuse or on graceful shutdown of worker processes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
