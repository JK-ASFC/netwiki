---
title: "merge_slashes"
description: "Directive nginx merge_slashes (ngx_http_core_module) — Enables or disables compression of two or more adjacent slashes in a URI into a single slash. Note that compression is essential for the correct matching of prefix string and regular expression…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `merge_slashes on \| off;` |
| **Valeur par défaut** | `merge_slashes on;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables compression of two or more adjacent slashes in a URI into a single slash.

Note that compression is essential for the correct matching of prefix string and regular expression locations. Without it, the “`//scripts/one.php`” request would not match

```nginx
location /scripts/ {
    ...
}
```

and might be processed as a static file. So it gets converted to “`/scripts/one.php`”.

Turning the compression `off` can become necessary if a URI contains base64-encoded names, since base64 uses the “`/`” character internally. However, for security considerations, it is better to avoid turning the compression off.

If the directive is specified on the [[12-directives/server-http-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
