---
title: "json_set"
description: "Directive nginx json_set (ngx_http_json_module) — Sets the variable to the value extracted from the JSON document held in the source variable at the given path. In a path, object members are separated by a dot, and array elements are addressed by a…"
tags: [nginx, directive, ngx_http_json_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `json_set $variable $source path;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_json_module\|ngx_http_json_module]] |

## Utilisation

Sets the *variable* to the value extracted from the JSON document held in the *source* variable at the given *path*.

In a path, object members are separated by a dot, and array elements are addressed by a zero-based index in square brackets:

```nginx
client_body_early_read on;

json_set $req_id     $request_body request.id;
json_set $enabled    $request_body settings.enabled;
json_set $first_item $request_body items[0];
```

A member name that is empty or contains “`.`”, “`[`”, or “`]`” is written as a JSON string in square brackets. Since such a path contains double quotes, the whole argument needs to be quoted in the configuration file:

```nginx
json_set $domain $request_body '["a.b.com"]';
json_set $nested $request_body 'obj["a.b"].c[2]';
```

The value of a JSON string is stored unescaped. The values of numbers, booleans, and `null` are stored as they appear in the document. If the path addresses an object or an array, its whole text is stored, including the enclosing braces or brackets.

If the addressed member or element is absent, the variable is not found. If the *source* variable is empty or not found, or if its value is not a valid, complete JSON document, then all variables extracted from this source are not found.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
