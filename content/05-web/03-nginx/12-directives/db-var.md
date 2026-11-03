---
title: "db_var"
description: "Directive nginx db_var (ngx_http_db_module) — Creates a variable whose value is obtained from the response body of a subrequest. The location parameter sets the subrequest URI. The query parameter sets its query string. An empty query string can…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_var $variable location=URI query=string [default=string];` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Creates a variable whose value is obtained from the response body of a subrequest. The `location` parameter sets the subrequest URI. The `query` parameter sets its query string. An empty query string can be specified explicitly:

```nginx
db_var $configuration /_configuration "";
```

The parameter values can contain text, variables, and their combination.

If the subrequest returns the `200 OK`, its response body is assigned to the variable. An empty response body is a valid value.

If the subrequest returns the `404 Not Found`, the value specified by the `default` parameter is assigned to the variable. The parameter value can contain variables. If no `default` parameter is specified, the variable is marked as not found.

Variables are populated during the pre-access phase, not when first evaluated. They should be consumed in subsequent processing phases, such as access or content processing. Reading them earlier, for example in rewrite-phase [[12-directives/if|if]], [[12-directives/set-http-rewrite|set]], or [[12-directives/return-http-rewrite|return]] processing, does not initiate a lookup.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
