---
title: "f4f_buffer_size"
description: "Directive nginx f4f_buffer_size (ngx_http_f4f_module) — Sets the size of the buffer used for reading the .f4x index file."
tags: [nginx, directive, ngx_http_f4f_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `f4f_buffer_size size;` |
| **Valeur par défaut** | `f4f_buffer_size 512k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_f4f_module\|ngx_http_f4f_module]] |

## Utilisation

Sets the *size* of the buffer used for reading the `.f4x` index file.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
