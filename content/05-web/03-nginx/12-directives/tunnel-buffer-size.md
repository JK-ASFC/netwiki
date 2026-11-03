---
title: "tunnel_buffer_size"
description: "Directive nginx tunnel_buffer_size (ngx_http_tunnel_module) — Sets the size of the buffer used for reading data from the backend server. Also sets the size of the buffer used for reading data from the client."
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_buffer_size size;` |
| **Valeur par défaut** | `tunnel_buffer_size 16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Sets the *size* of the buffer used for reading data from the backend server. Also sets the *size* of the buffer used for reading data from the client.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
