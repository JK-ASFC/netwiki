---
title: "xslt_string_param"
description: "Directive nginx xslt_string_param (ngx_http_xslt_module) — Définit les paramètres chaînes des feuilles de style XSLT. Les expressions XPath de la valeur (value) ne sont pas interprétées. La valeur peut contenir des variables. Il peut y avoir plusieurs…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_string_param parameter value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.18 |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Définit les paramètres chaînes des feuilles de style XSLT. Les expressions XPath de la valeur (*value*) ne sont pas interprétées. La valeur peut contenir des variables.

Il peut y avoir plusieurs directives `xslt_string_param`. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive [[12-directives/xslt-param|xslt_param]] ni `xslt_string_param` n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
