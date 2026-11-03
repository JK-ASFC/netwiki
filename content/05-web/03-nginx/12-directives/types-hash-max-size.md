---
title: "types_hash_max_size"
description: "Directive nginx types_hash_max_size (ngx_http_core_module) — Sets the maximum size of the types hash tables. The details of setting up hash tables are provided in a separate document."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `types_hash_max_size size;` |
| **Valeur par défaut** | `types_hash_max_size 1024;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the maximum *size* of the types hash tables. The details of setting up hash tables are provided in a separate [[10-guides/01-introduction/hash|document]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
