---
title: "uwsgi_request_buffering"
description: "Directive nginx uwsgi_request_buffering (ngx_http_uwsgi_module) — Enables or disables buffering of a client request body. When buffering is enabled, the entire request body is read from the client before sending the request to a uwsgi server. When buffering is…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_request_buffering on \| off;` |
| **Valeur par défaut** | `uwsgi_request_buffering on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Enables or disables buffering of a client request body.

When buffering is enabled, the entire request body is [[12-directives/client-body-buffer-size|read]] from the client before sending the request to a uwsgi server.

When buffering is disabled, the request body is sent to the uwsgi server immediately as it is received. In this case, the request cannot be passed to the [[12-directives/uwsgi-next-upstream|next server]] if nginx already started sending the request body.

When HTTP/1.1 chunked transfer encoding is used to send the original request body, the request body will be buffered regardless of the directive value.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
