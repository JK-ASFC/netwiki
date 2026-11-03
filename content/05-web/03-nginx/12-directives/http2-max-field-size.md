---
title: "http2_max_field_size"
description: "Directive nginx http2_max_field_size (ngx_http_v2_module) — NOTE This directive is obsolete since version 1.19.7. The large_client_header_buffers directive should be used instead. Limits the maximum size of an HPACK-compressed request header field. The limit…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_max_field_size size;` |
| **Valeur par défaut** | `http2_max_field_size 4k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> This directive is obsolete since version 1.19.7. The [[12-directives/large-client-header-buffers|large_client_header_buffers]] directive should be used instead.

Limits the maximum size of an [HPACK](https://datatracker.ietf.org/doc/html/rfc7541)-compressed request header field. The limit applies equally to both name and value. Note that if Huffman encoding is applied, the actual size of decompressed name and value strings may be larger. For most requests, the default limit should be enough.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
