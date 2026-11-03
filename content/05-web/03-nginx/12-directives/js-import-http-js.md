---
title: "js_import (ngx_http_js_module)"
description: "Directive nginx js_import (ngx_http_js_module) — Importe un module qui met en œuvre des gestionnaires de location, de variables et de filtres en njs. export_name sert d'espace de noms pour accéder aux fonctions du module ; s'il n'est pas indiqué,…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_import module.js \| export_name from module.js;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.4.0 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Importe un module qui met en œuvre des gestionnaires de location, de variables et de filtres en njs. `export_name` sert d'espace de noms pour accéder aux fonctions du module ; s'il n'est pas indiqué, le nom du module est utilisé.

```nginx
js_import http.js;
```

Ici, le nom de module `http` sert d'espace de noms pour accéder aux exports. Si le module importé exporte `foo()`, on y fait référence par `http.foo`.

Plusieurs directives `js_import` peuvent être indiquées.

Lorsque `js_import` est indiqué dans un bloc [[12-directives/location|location]], les modules importés ne sont visibles que si aucun code JavaScript n'a été appelé plus tôt dans la requête. Une seule machine virtuelle est créée par requête, lors du premier accès à une variable [[12-directives/js-set-http-js|js_set]] ou du premier appel d'un gestionnaire [[12-directives/js-content|js_content]], [[12-directives/js-header-filter|js_header_filter]], [[12-directives/js-body-filter|js_body_filter]] ou [[12-directives/js-access-http-js|js_access]]. Elle est clonée depuis le contexte de configuration actif à ce moment, et tous les appels JavaScript suivants de la requête la réutilisent. Ainsi, si l'un de ces éléments est utilisé avant que la requête ne soit associée à son bloc location final, par exemple depuis un [[12-directives/set-http-rewrite|set]] au niveau server, la machine virtuelle est liée aux imports du contexte extérieur et les modules importés dans le `location` correspondant ne sont pas visibles. Pour l'éviter, déclarez ces imports dans un contexte parent commun.

> [!NOTE]
> La directive peut être indiquée aux niveaux `server` et `location` depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
