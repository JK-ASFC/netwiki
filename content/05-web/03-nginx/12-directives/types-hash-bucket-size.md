---
title: "types_hash_bucket_size"
description: "Directive nginx types_hash_bucket_size (ngx_http_core_module) — Sets the bucket size for the types hash tables. The details of setting up hash tables are provided in a separate document. NOTE Prior to version 1.5.13, the default value depended on the size of the…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `types_hash_bucket_size size;` |
| **Valeur par défaut** | `types_hash_bucket_size 64;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the bucket size for the types hash tables. The details of setting up hash tables are provided in a separate [[10-guides/01-introduction/hash|document]].

> [!NOTE]
> Prior to version 1.5.13, the default value depended on the size of the processor’s cache line.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
