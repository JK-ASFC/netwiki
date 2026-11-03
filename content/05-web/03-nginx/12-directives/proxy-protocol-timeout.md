---
title: "proxy_protocol_timeout"
description: "Directive nginx proxy_protocol_timeout (ngx_stream_core_module) — Specifies a timeout for reading the PROXY protocol header to complete. If no entire header is transmitted within this time, the connection is closed."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_protocol_timeout timeout;` |
| **Valeur par défaut** | `proxy_protocol_timeout 30s;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Specifies a *timeout* for reading the PROXY protocol header to complete. If no entire header is transmitted within this time, the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
