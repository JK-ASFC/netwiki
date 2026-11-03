---
title: "fastcgi_max_temp_file_size"
description: "Directive nginx fastcgi_max_temp_file_size (ngx_http_fastcgi_module) — When buffering of responses from the FastCGI server is enabled, and the whole response does not fit into the buffers set by the fastcgi_buffer_size and fastcgi_buffers directives, a part of the…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_max_temp_file_size size;` |
| **Valeur par défaut** | `fastcgi_max_temp_file_size 1024m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

When [[12-directives/fastcgi-buffering|buffering]] of responses from the FastCGI server is enabled, and the whole response does not fit into the buffers set by the [[12-directives/fastcgi-buffer-size|fastcgi_buffer_size]] and [[12-directives/fastcgi-buffers|fastcgi_buffers]] directives, a part of the response can be saved to a temporary file. This directive sets the maximum *size* of the temporary file. The size of data written to the temporary file at a time is set by the [[12-directives/fastcgi-temp-file-write-size|fastcgi_temp_file_write_size]] directive.

La valeur zéro désactive la mise en tampon des réponses dans des fichiers temporaires.

> [!NOTE]
> This restriction does not apply to responses that will be [[12-directives/fastcgi-cache|cached]] or [[12-directives/fastcgi-store|stored]] on disk.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
