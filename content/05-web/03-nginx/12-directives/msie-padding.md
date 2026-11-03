---
title: "msie_padding"
description: "Directive nginx msie_padding (ngx_http_core_module) — Enables or disables adding comments to responses for MSIE clients with status greater than 400 to increase the response size to 512 bytes."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `msie_padding on \| off;` |
| **Valeur par défaut** | `msie_padding on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables adding comments to responses for MSIE clients with status greater than 400 to increase the response size to 512 bytes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
