---
title: "server_names_hash_max_size (ngx_http_core_module)"
description: "Directive nginx server_names_hash_max_size (ngx_http_core_module) — Sets the maximum size of the server names hash tables. The details of setting up hash tables are provided in a separate document."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_names_hash_max_size size;` |
| **Valeur par défaut** | `server_names_hash_max_size 512;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the maximum *size* of the server names hash tables. The details of setting up hash tables are provided in a separate [[10-guides/01-introduction/hash|document]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
