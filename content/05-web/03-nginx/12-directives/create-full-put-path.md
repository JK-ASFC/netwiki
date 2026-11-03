---
title: "create_full_put_path"
description: "Directive nginx create_full_put_path (ngx_http_dav_module) — The WebDAV specification only allows creating files in already existing directories. This directive allows creating all needed intermediate directories."
tags: [nginx, directive, ngx_http_dav_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `create_full_put_path on \| off;` |
| **Valeur par défaut** | `create_full_put_path off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_dav_module\|ngx_http_dav_module]] |

## Utilisation

The WebDAV specification only allows creating files in already existing directories. This directive allows creating all needed intermediate directories.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
