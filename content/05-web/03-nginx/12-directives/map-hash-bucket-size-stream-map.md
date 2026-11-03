---
title: "map_hash_bucket_size (ngx_stream_map_module)"
description: "Directive nginx map_hash_bucket_size (ngx_stream_map_module) — Sets the bucket size for the map variables hash tables. Default value depends on the processor’s cache line size. The details of setting up hash tables are provided in a separate document."
tags: [nginx, directive, ngx_stream_map_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `map_hash_bucket_size size;` |
| **Valeur par défaut** | `map_hash_bucket_size 32\|64\|128;` |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_map_module\|ngx_stream_map_module]] |

## Utilisation

Sets the bucket size for the [[12-directives/map-stream-map|map]] variables hash tables. Default value depends on the processor’s cache line size. The details of setting up hash tables are provided in a separate [[10-guides/01-introduction/hash|document]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
