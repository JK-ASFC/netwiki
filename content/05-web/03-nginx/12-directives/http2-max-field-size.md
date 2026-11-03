---
title: "http2_max_field_size"
description: "Directive nginx http2_max_field_size (ngx_http_v2_module) — NOTE Cette directive est obsolète depuis la version 1.19.7. Utiliser à la place la directive large_client_header_buffers. Limite la taille maximale d'un champ d'en-tête de requête compressé avec…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_max_field_size size;` |
| **Valeur par défaut** | `http2_max_field_size 4k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> Cette directive est obsolète depuis la version 1.19.7. Utiliser à la place la directive [[12-directives/large-client-header-buffers|large_client_header_buffers]].

Limite la taille maximale d'un champ d'en-tête de requête compressé avec [HPACK](https://datatracker.ietf.org/doc/html/rfc7541). La limite s'applique au nom comme à la valeur. Si le codage de Huffman est appliqué, la taille réelle des chaînes décompressées peut être supérieure. Pour la plupart des requêtes, la limite par défaut suffit.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
