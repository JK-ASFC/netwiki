---
title: "if"
description: "Directive nginx if (ngx_http_rewrite_module) — La condition (condition) indiquée est évaluée. Si elle est vraie, les directives de ce module placées entre les accolades sont exécutées et la requête reçoit la configuration définie dans la…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `if (condition) { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

La condition (*condition*) indiquée est évaluée. Si elle est vraie, les directives de ce module placées entre les accolades sont exécutées et la requête reçoit la configuration définie dans la directive `if`. Les configurations à l'intérieur des directives `if` héritent du niveau de configuration précédent.

Une condition peut être :

- un nom de variable ; la condition est fausse si la valeur de la variable est une chaîne vide ou « `0` » ;

  > [!NOTE]
  > Avant la version 1.0.1, toute chaîne commençant par « `0` » était considérée comme fausse.
- la comparaison d'une variable avec une chaîne à l'aide des opérateurs « `=` » et « `!=` » ;
- la correspondance d'une variable avec une expression régulière à l'aide des opérateurs « `~` » (sensible à la casse) et « `~*` » (insensible à la casse). Les expressions régulières peuvent contenir des captures réutilisables ensuite dans les variables `$1`..`$9` (voir [[10-guides/01-introduction/regex-captures|Captures des expressions régulières]]). Les opérateurs de négation « `!~` » et « `!~*` » sont aussi disponibles. Si une expression régulière contient les caractères « `}` » ou « `;` », l'expression entière doit être placée entre guillemets simples ou doubles.
- la vérification de l'existence d'un fichier avec les opérateurs « `-f` » et « `!-f` » ;
- la vérification de l'existence d'un répertoire avec les opérateurs « `-d` » et « `!-d` » ;
- la vérification de l'existence d'un fichier, d'un répertoire ou d'un lien symbolique avec les opérateurs « `-e` » et « `!-e` » ;
- la vérification d'un fichier exécutable avec les opérateurs « `-x` » et « `!-x` ».

Exemples :

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
> La valeur de la variable intégrée `$invalid_referer` est définie par la directive [[12-directives/valid-referers|valid_referers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
