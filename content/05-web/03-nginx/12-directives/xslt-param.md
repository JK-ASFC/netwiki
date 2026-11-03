---
title: "xslt_param"
description: "Directive nginx xslt_param (ngx_http_xslt_module) — Définit les paramètres des feuilles de style XSLT. La valeur (value) est traitée comme une expression XPath et peut contenir des variables. Pour transmettre une chaîne à une feuille de style,…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_param parameter value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.18 |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Définit les paramètres des feuilles de style XSLT. La valeur (*value*) est traitée comme une expression XPath et peut contenir des variables. Pour transmettre une chaîne à une feuille de style, utilisez la directive [[12-directives/xslt-string-param|xslt_string_param]].

Il peut y avoir plusieurs directives `xslt_param`. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `xslt_param` ni [[12-directives/xslt-string-param|xslt_string_param]] n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
