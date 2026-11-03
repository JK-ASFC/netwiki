---
title: "proxy_buffer_size (ngx_stream_proxy_module)"
description: "Directive nginx proxy_buffer_size (ngx_stream_proxy_module) — Sets the size of the buffer used for reading data from the proxied server. Also sets the size of the buffer used for reading data from the client."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_buffer_size size;` |
| **Valeur par défaut** | `proxy_buffer_size 16k;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Sets the *size* of the buffer used for reading data from the proxied server. Also sets the *size* of the buffer used for reading data from the client.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
