---
title: "proxy_max_temp_file_size"
description: "Directive nginx proxy_max_temp_file_size (ngx_http_proxy_module) — When buffering of responses from the proxied server is enabled, and the whole response does not fit into the buffers set by the proxy_buffer_size and proxy_buffers directives, a part of the response…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_max_temp_file_size size;` |
| **Valeur par défaut** | `proxy_max_temp_file_size 1024m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

When [[12-directives/proxy-buffering|buffering]] of responses from the proxied server is enabled, and the whole response does not fit into the buffers set by the [[12-directives/proxy-buffer-size-http-proxy|proxy_buffer_size]] and [[12-directives/proxy-buffers|proxy_buffers]] directives, a part of the response can be saved to a temporary file. This directive sets the maximum *size* of the temporary file. The size of data written to the temporary file at a time is set by the [[12-directives/proxy-temp-file-write-size|proxy_temp_file_write_size]] directive.

The zero value disables buffering of responses to temporary files.

> [!NOTE]
> This restriction does not apply to responses that will be [[12-directives/proxy-cache|cached]] or [[12-directives/proxy-store|stored]] on disk.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
