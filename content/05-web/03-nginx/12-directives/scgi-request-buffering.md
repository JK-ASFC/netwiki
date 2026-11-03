---
title: "scgi_request_buffering"
description: "Directive nginx scgi_request_buffering (ngx_http_scgi_module) — Active ou désactive la mise en tampon du corps de la requête du client. When buffering is enabled, the entire request body is read from the client before sending the request to an SCGI server. When…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_request_buffering on \| off;` |
| **Valeur par défaut** | `scgi_request_buffering on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Active ou désactive la mise en tampon du corps de la requête du client.

When buffering is enabled, the entire request body is [[12-directives/client-body-buffer-size|read]] from the client before sending the request to an SCGI server.

When buffering is disabled, the request body is sent to the SCGI server immediately as it is received. In this case, the request cannot be passed to the [[12-directives/scgi-next-upstream|next server]] if nginx already started sending the request body.

When HTTP/1.1 chunked transfer encoding is used to send the original request body, the request body will be buffered regardless of the directive value.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
