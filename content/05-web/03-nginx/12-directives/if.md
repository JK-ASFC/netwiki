---
title: "if"
description: "Directive nginx if (ngx_http_rewrite_module) — The specified condition is evaluated. If true, this module directives specified inside the braces are executed, and the request is assigned the configuration inside the if directive. Configurations…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `if (condition) { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

The specified *condition* is evaluated. If true, this module directives specified inside the braces are executed, and the request is assigned the configuration inside the `if` directive. Configurations inside the `if` directives are inherited from the previous configuration level.

A condition may be any of the following:

- a variable name; false if the value of a variable is an empty string or “`0`”;

  > [!NOTE]
  > Before version 1.0.1, any string starting with “`0`” was considered a false value.
- comparison of a variable with a string using the “`=`” and “`!=`” operators;
- matching of a variable against a regular expression using the “`~`” (for case-sensitive matching) and “`~*`” (for case-insensitive matching) operators. Regular expressions can contain captures that are made available for later reuse in the `$1`..`$9` variables (see [[10-guides/01-introduction/regex-captures|Regular expression captures]]). Negative operators “`!~`” and “`!~*`” are also available. If a regular expression includes the “`}`” or “`;`” characters, the whole expressions should be enclosed in single or double quotes.
- checking of a file existence with the “`-f`” and “`!-f`” operators;
- checking of a directory existence with the “`-d`” and “`!-d`” operators;
- checking of a file, directory, or symbolic link existence with the “`-e`” and “`!-e`” operators;
- checking for an executable file with the “`-x`” and “`!-x`” operators.

Examples:

```nginx
if ($http_user_agent ~ MSIE) {
    rewrite ^(.*)$ /msie/$1 break;
}

if ($http_cookie ~* "id=([^;]+)(?:;|$)") {
    set $id $1;
}

if ($request_method = POST) {
    return 405;
}

if ($slow) {
    limit_rate 10k;
}

if ($invalid_referer) {
    return 403;
}
```

> [!NOTE]
> A value of the `$invalid_referer` embedded variable is set by the [[12-directives/valid-referers|valid_referers]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
