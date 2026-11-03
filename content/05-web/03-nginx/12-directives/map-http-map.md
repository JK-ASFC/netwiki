---
title: "map (ngx_http_map_module)"
description: "Directive nginx map (ngx_http_map_module) — Creates a new variable whose value depends on values of one or more of the source variables specified in the first parameter. NOTE Before version 0.9.0 only a single variable could be specified in…"
tags: [nginx, directive, ngx_http_map_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `map string $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_map_module\|ngx_http_map_module]] |

## Utilisation

Creates a new variable whose value depends on values of one or more of the source variables specified in the first parameter.

> [!NOTE]
> Before version 0.9.0 only a single variable could be specified in the first parameter.

> [!NOTE]
> Since variables are evaluated only when they are used, the mere declaration even of a large number of “`map`” variables does not add any extra costs to request processing.

Parameters inside the `map` block specify a mapping between source and resulting values.

Source values are specified as strings or regular expressions (0.9.6).

Strings are matched ignoring the case.

A regular expression should either start from the “`~`” symbol for a case-sensitive matching, or from the “`~*`” symbols (1.0.4) for case-insensitive matching. A regular expression can contain named and positional captures that can later be used in other directives along with the resulting variable. The regular expressions are matched when the resulting variable is evaluated, and a successful match replaces the positional captures “`$1`”...“`$9`” set by previously matched regular expressions, see [[10-guides/01-introduction/regex-captures|Regular expression captures]].

If a source value matches one of the names of special parameters described below, it should be prefixed with the “`\`” symbol.

The resulting value can contain text, variable (0.9.0), and their combination (1.11.0).

The following special parameters are also supported:

- **`default` *value***

  sets the resulting value if the source value matches none of the specified variants. When `default` is not specified, the default resulting value will be an empty string.

- **`hostnames`**

  indicates that source values can be hostnames with a prefix or suffix mask:

  ```nginx
  *.example.com 1;
  example.*     1;
  ```

  The following two records

  ```nginx
  example.com   1;
  *.example.com 1;
  ```

  can be combined:

  ```nginx
  .example.com  1;
  ```

  This parameter should be specified before the list of values.

- **`include` *file***

  includes a file with values. There can be several inclusions.

- **`volatile`**

  indicates that the variable is not cacheable (1.11.7).

The search is performed in the following order of priority and terminates on the first matching variant:

1. the string value without a mask
2. the longest string value with a prefix mask, e.g. “`*.example.com`”
3. the longest string value with a suffix mask, e.g. “`mail.*`”
4. the first matching regular expression (in order of appearance in the configuration file)
5. the default value

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
