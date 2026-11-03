---
title: "api"
description: "Directive nginx api (ngx_http_api_module) — Active l'interface de l'API REST dans la location englobante. L'accès à cette location doit être restreint. Le paramètre write détermine si l'API est en lecture seule ou en lecture-écriture. Par…"
tags: [nginx, directive, ngx_http_api_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `api [write=on\|off];` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_api_module\|ngx_http_api_module]] |

## Utilisation

Active l'interface de l'API REST dans la location englobante. L'accès à cette location doit être [[12-directives/satisfy|restreint]].

Le paramètre `write` détermine si l'API est en lecture seule ou en lecture-écriture. Par défaut, elle est en lecture seule.

Toutes les requêtes à l'API doivent contenir une version d'API prise en charge dans l'URI. Si l'URI de la requête est égale au préfixe de la location, la liste des versions prises en charge est renvoyée. La version actuelle de l'API est « `10` ».

L'argument facultatif « `fields` » de la ligne de requête indique quels champs des objets demandés seront affichés :

```nginx
http://127.0.0.1/api/10/nginx?fields=version,build
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
