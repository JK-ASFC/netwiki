---
title: "error_log_tag"
description: "Directive nginx error_log_tag (ngx_http_core_module) — Defines an additional context tag for HTTP error log messages in text or JSON format, in addition to default tags. The value can contain text, variables, and their combination: nginx error_log_tag…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `error_log_tag name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.8 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Defines an additional context tag for HTTP [[12-directives/error-log|error log]] messages in text or [[11-modules/01-coeur/Core functionality|JSON]] format, in addition to default tags. The `value` can contain text, variables, and their combination:

```nginx
error_log_tag  request_id  $request_id;
```

Several `error_log_tag` directives can be specified on the same level. These directives are inherited from the previous configuration level if and only if there are no `error_log_tag` directives defined on the current level.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
