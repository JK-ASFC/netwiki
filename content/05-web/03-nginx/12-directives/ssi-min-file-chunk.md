---
title: "ssi_min_file_chunk"
description: "Directive nginx ssi_min_file_chunk (ngx_http_ssi_module) — Sets the minimum size for parts of a response stored on disk, starting from which it makes sense to send them using sendfile."
tags: [nginx, directive, ngx_http_ssi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssi_min_file_chunk size;` |
| **Valeur par défaut** | `ssi_min_file_chunk 1k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_ssi_module\|ngx_http_ssi_module]] |

## Utilisation

Sets the minimum *size* for parts of a response stored on disk, starting from which it makes sense to send them using [[12-directives/sendfile|sendfile]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
