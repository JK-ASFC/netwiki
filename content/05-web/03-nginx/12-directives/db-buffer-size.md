---
title: "db_buffer_size"
description: "Directive nginx db_buffer_size (ngx_http_db_module) — Sets the size of the buffer used for reading the database response. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform. It can be made smaller,…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_buffer_size size;` |
| **Valeur par défaut** | `db_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Sets the size of the buffer used for reading the database response. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform. It can be made smaller, however.

The buffer is also used when parsing database protocol replies. A protocol reply header that does not fit in the buffer cannot be processed successfully.

Database response bodies are processed without upstream response buffering.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
