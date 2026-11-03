---
title: "output_buffers"
description: "Directive nginx output_buffers (ngx_http_core_module) — Sets the number and size of the buffers used for reading a response from a disk. NOTE Prior to version 1.9.5, the default value was 1 32k."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `output_buffers number size;` |
| **Valeur par défaut** | `output_buffers 2 32k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the *number* and *size* of the buffers used for reading a response from a disk.

> [!NOTE]
> Prior to version 1.9.5, the default value was 1 32k.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
