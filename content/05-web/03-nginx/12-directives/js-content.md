---
title: "js_content"
description: "Directive nginx js_content (ngx_http_js_module) — Sets an njs function as a location content handler. Since 0.4.0, a module function can be referenced. NOTE The directive can be specified inside the if block since 0.7.7."
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_content module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Sets an njs function as a location content handler. Since 0.4.0, a module function can be referenced.

> [!NOTE]
> The directive can be specified inside the [[12-directives/if|if]] block since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
