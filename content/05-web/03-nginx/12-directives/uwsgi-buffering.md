---
title: "uwsgi_buffering"
description: "Directive nginx uwsgi_buffering (ngx_http_uwsgi_module) — Enables or disables buffering of responses from the uwsgi server. When buffering is enabled, nginx receives a response from the uwsgi server as soon as possible, saving it into the buffers set by the…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_buffering on \| off;` |
| **Valeur par défaut** | `uwsgi_buffering on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Enables or disables buffering of responses from the uwsgi server.

When buffering is enabled, nginx receives a response from the uwsgi server as soon as possible, saving it into the buffers set by the [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]] and [[12-directives/uwsgi-buffers|uwsgi_buffers]] directives. If the whole response does not fit into memory, a part of it can be saved to a [[12-directives/uwsgi-temp-path|temporary file]] on the disk. Writing to temporary files is controlled by the [[12-directives/uwsgi-max-temp-file-size|uwsgi_max_temp_file_size]] and [[12-directives/uwsgi-temp-file-write-size|uwsgi_temp_file_write_size]] directives.

When buffering is disabled, the response is passed to a client synchronously, immediately as it is received. nginx will not try to read the whole response from the uwsgi server. The maximum size of the data that nginx can receive from the server at a time is set by the [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]] directive.

Buffering can also be enabled or disabled by passing “`yes`” or “`no`” in the `X-Accel-Buffering` response header field. This capability can be disabled using the [[12-directives/uwsgi-ignore-headers|uwsgi_ignore_headers]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
