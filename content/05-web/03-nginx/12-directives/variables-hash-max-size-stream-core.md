---
title: "variables_hash_max_size (ngx_stream_core_module)"
description: "Directive nginx variables_hash_max_size (ngx_stream_core_module) — Sets the maximum size of the variables hash table. The details of setting up hash tables are provided in a separate document."
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `variables_hash_max_size size;` |
| **Valeur par défaut** | `variables_hash_max_size 1024;` |
| **Contexte** | `stream` |
| **Apparue dans la version** | 1.11.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Sets the maximum *size* of the variables hash table. The details of setting up hash tables are provided in a separate [[10-guides/01-introduction/hash|document]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
