---
title: "scgi_max_temp_file_size"
description: "Directive nginx scgi_max_temp_file_size (ngx_http_scgi_module) — When buffering of responses from the SCGI server is enabled, and the whole response does not fit into the buffers set by the scgi_buffer_size and scgi_buffers directives, a part of the response can…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_max_temp_file_size size;` |
| **Valeur par défaut** | `scgi_max_temp_file_size 1024m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

When [[12-directives/scgi-buffering|buffering]] of responses from the SCGI server is enabled, and the whole response does not fit into the buffers set by the [[12-directives/scgi-buffer-size|scgi_buffer_size]] and [[12-directives/scgi-buffers|scgi_buffers]] directives, a part of the response can be saved to a temporary file. This directive sets the maximum *size* of the temporary file. The size of data written to the temporary file at a time is set by the [[12-directives/scgi-temp-file-write-size|scgi_temp_file_write_size]] directive.

The zero value disables buffering of responses to temporary files.

> [!NOTE]
> This restriction does not apply to responses that will be [[12-directives/scgi-cache|cached]] or [[12-directives/scgi-store|stored]] on disk.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
