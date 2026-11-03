---
title: "large_client_header_buffers"
description: "Directive nginx large_client_header_buffers (ngx_http_core_module) — Sets the maximum number and size of buffers used for reading large client request header. A request line cannot exceed the size of one buffer, or the 414 Request-URI Too Large error is returned to…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `large_client_header_buffers number size;` |
| **Valeur par défaut** | `large_client_header_buffers 4 8k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the maximum *number* and *size* of buffers used for reading large client request header. A request line cannot exceed the size of one buffer, or the `414 Request-URI Too Large` error is returned to the client. A request header field cannot exceed the size of one buffer as well, or the `400 Bad Request` error is returned to the client. Buffers are allocated only on demand. By default, the buffer size is equal to 8K bytes. If after the end of request processing a connection is transitioned into the keep-alive state, these buffers are released.

The limits are similarly applied in HTTP/2 and HTTP/3 connections. The size of one buffer limits the maximum size of a request header field compressed with [HPACK](https://datatracker.ietf.org/doc/html/rfc7541) and [QPACK](https://datatracker.ietf.org/doc/html/rfc9204), respectively. Note that if Huffman encoding is applied, the actual size of decompressed name and value strings may be larger. The maximum size of the entire request header is limited after decompression.

If the directive is specified on the [[12-directives/server-http-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
