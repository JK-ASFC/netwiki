---
title: "mirror"
description: "Directive nginx mirror (ngx_http_mirror_module) — Sets the URI to which an original request will be mirrored. Several mirrors can be specified on the same configuration level."
tags: [nginx, directive, ngx_http_mirror_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mirror uri \| off;` |
| **Valeur par défaut** | `mirror off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mirror_module\|ngx_http_mirror_module]] |

## Utilisation

Sets the URI to which an original request will be mirrored. Several mirrors can be specified on the same configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
