---
title: "xslt_stylesheet"
description: "Directive nginx xslt_stylesheet (ngx_http_xslt_module) — Définit la feuille de style XSLT et ses paramètres facultatifs. La feuille de style est compilée lors de la configuration. Les paramètres peuvent être indiqués séparément ou regroupés sur une ligne…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_stylesheet stylesheet [parameter=value ...];` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Définit la feuille de style XSLT et ses paramètres facultatifs. La feuille de style est compilée lors de la configuration.

Les paramètres peuvent être indiqués séparément ou regroupés sur une ligne avec le séparateur « `:` ». Si un paramètre contient le caractère « `:` », il doit être échappé en « `%3A` ». En outre, `libxslt` exige que les paramètres contenant des caractères non alphanumériques soient placés entre guillemets simples ou doubles, par exemple :

```nginx
param1='http%3A//www.example.com':param2=value2
```

La description des paramètres peut contenir des variables ; par exemple, toute la ligne de paramètres peut provenir d'une seule variable :

```nginx
location / {
    xslt_stylesheet /site/xslt/one.xslt
                    $arg_xslt_params
                    param1='$value1':param2=value2
                    param3=value3;
}
```

On peut indiquer plusieurs feuilles de style ; elles sont appliquées successivement dans l'ordre indiqué.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
