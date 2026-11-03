---
title: "add_after_body"
description: "Directive nginx add_after_body (ngx_http_addition_module) — Adds the text returned as a result of processing a given subrequest after the response body. An empty string (\"\") as a parameter cancels addition inherited from the previous configuration level."
tags: [nginx, directive, ngx_http_addition_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `add_after_body uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_addition_module\|ngx_http_addition_module]] |

## Utilisation

Adds the text returned as a result of processing a given subrequest after the response body. An empty string (`""`) as a parameter cancels addition inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
