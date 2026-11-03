---
title: "uwsgi_temp_file_write_size"
description: "Directive nginx uwsgi_temp_file_write_size (ngx_http_uwsgi_module) — Limits the size of data written to a temporary file at a time, when buffering of responses from the uwsgi server to temporary files is enabled. By default, size is limited by two buffers set by the…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_temp_file_write_size size;` |
| **Valeur par défaut** | `uwsgi_temp_file_write_size 8k\|16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Limits the *size* of data written to a temporary file at a time, when buffering of responses from the uwsgi server to temporary files is enabled. By default, *size* is limited by two buffers set by the [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]] and [[12-directives/uwsgi-buffers|uwsgi_buffers]] directives. The maximum size of a temporary file is set by the [[12-directives/uwsgi-max-temp-file-size|uwsgi_max_temp_file_size]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
