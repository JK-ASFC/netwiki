---
title: "proxy_temp_file_write_size"
description: "Directive nginx proxy_temp_file_write_size (ngx_http_proxy_module) — Limits the size of data written to a temporary file at a time, when buffering of responses from the proxied server to temporary files is enabled. By default, size is limited by two buffers set by the…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_temp_file_write_size size;` |
| **Valeur par défaut** | `proxy_temp_file_write_size 8k\|16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Limits the *size* of data written to a temporary file at a time, when buffering of responses from the proxied server to temporary files is enabled. By default, *size* is limited by two buffers set by the [[12-directives/proxy-buffer-size-http-proxy|proxy_buffer_size]] and [[12-directives/proxy-buffers|proxy_buffers]] directives. The maximum size of a temporary file is set by the [[12-directives/proxy-max-temp-file-size|proxy_max_temp_file_size]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
