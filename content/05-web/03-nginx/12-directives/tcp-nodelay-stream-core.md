---
title: "tcp_nodelay (ngx_stream_core_module)"
description: "Directive nginx tcp_nodelay (ngx_stream_core_module) — Enables or disables the use of the TCP_NODELAY option. The option is enabled for both client and proxied server connections."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tcp_nodelay on \| off;` |
| **Valeur par défaut** | `tcp_nodelay on;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Enables or disables the use of the `TCP_NODELAY` option. The option is enabled for both client and proxied server connections.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
