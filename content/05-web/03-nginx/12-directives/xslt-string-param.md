---
title: "xslt_string_param"
description: "Directive nginx xslt_string_param (ngx_http_xslt_module) — Defines the string parameters for XSLT stylesheets. XPath expressions in the value are not interpreted. The value can contain variables. There could be several xslt_string_param directives. These…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_string_param parameter value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.18 |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Defines the string parameters for XSLT stylesheets. XPath expressions in the *value* are not interpreted. The *value* can contain variables.

There could be several `xslt_string_param` directives. These directives are inherited from the previous configuration level if and only if there are no [[12-directives/xslt-param|xslt_param]] and `xslt_string_param` directives defined on the current level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
