---
title: "default_type"
description: "Directive nginx default_type (ngx_http_core_module) — Defines the default MIME type of a response. Mapping of file name extensions to MIME types can be set with the types directive."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `default_type mime-type;` |
| **Valeur par défaut** | `default_type text/plain;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Defines the default MIME type of a response. Mapping of file name extensions to MIME types can be set with the [[12-directives/types|types]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
