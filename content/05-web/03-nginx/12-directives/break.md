---
title: "break"
description: "Directive nginx break (ngx_http_rewrite_module) — Stops processing the current set of ngx_http_rewrite_module directives. If a directive is specified inside the location, further processing of the request continues in this location. Example: nginx…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `break;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

Stops processing the current set of `ngx_http_rewrite_module` directives.

If a directive is specified inside the [[12-directives/location|location]], further processing of the request continues in this location.

Example:

```nginx
if ($slow) {
    limit_rate 10k;
    break;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
