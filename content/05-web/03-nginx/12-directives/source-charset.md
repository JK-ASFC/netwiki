---
title: "source_charset"
description: "Directive nginx source_charset (ngx_http_charset_module) — Defines the source charset of a response. If this charset is different from the charset specified in the charset directive, a conversion is performed."
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `source_charset charset;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Defines the source charset of a response. If this charset is different from the charset specified in the [[12-directives/charset|charset]] directive, a conversion is performed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
