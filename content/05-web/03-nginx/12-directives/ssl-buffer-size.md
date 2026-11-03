---
title: "ssl_buffer_size"
description: "Directive nginx ssl_buffer_size (ngx_http_ssl_module) — Sets the size of the buffer used for sending data. By default, the buffer size is 16k, which corresponds to minimal overhead when sending big responses. To minimize Time To First Byte it may be…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_buffer_size size;` |
| **Valeur par défaut** | `ssl_buffer_size 16k;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.5.9 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Sets the size of the buffer used for sending data.

By default, the buffer size is 16k, which corresponds to minimal overhead when sending big responses. To minimize Time To First Byte it may be beneficial to use smaller values, for example:

```nginx
ssl_buffer_size 4k;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
