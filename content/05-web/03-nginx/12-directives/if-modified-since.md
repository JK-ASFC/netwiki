---
title: "if_modified_since"
description: "Directive nginx if_modified_since (ngx_http_core_module) — Specifies how to compare modification time of a response with the time in the If-Modified-Since request header field: - off the response is always considered modified (0.7.34); - exact exact match; -…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `if_modified_since off \| exact \| before;` |
| **Valeur par défaut** | `if_modified_since exact;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.24 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Specifies how to compare modification time of a response with the time in the `If-Modified-Since` request header field:

- **`off`**

  the response is always considered modified (0.7.34);

- **`exact`**

  exact match;

- **`before`**

  modification time of the response is less than or equal to the time in the `If-Modified-Since` request header field.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
