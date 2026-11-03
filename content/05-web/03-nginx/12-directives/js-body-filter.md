---
title: "js_body_filter"
description: "Directive nginx js_body_filter (ngx_http_js_module) — Définit une fonction njs comme filtre du corps de la réponse. La fonction de filtre est appelée pour chaque bloc de données du corps de la réponse, avec les arguments suivants : - r l'objet requête…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_body_filter module.function [buffer_type=string \| buffer];` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Apparue dans la version** | 0.5.2 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit une fonction njs comme filtre du corps de la réponse. La fonction de filtre est appelée pour chaque bloc de données du corps de la réponse, avec les arguments suivants :

- **`r`**

  l'objet [[10-guides/04-njs/reference|requête HTTP]]

- **`data`**

  le bloc de données entrant, chaîne ou Buffer selon la valeur de `buffer_type` (chaîne par défaut). Depuis la version 0.8.5, la valeur `data` est convertie implicitement par défaut en chaîne UTF-8 valide. Pour les données binaires, `buffer_type` doit valoir `buffer`.

- **`flags`**

  un objet avec les propriétés suivantes :

  - **`last`**

    un booléen, vrai si les données sont le dernier tampon.

La fonction de filtre peut transmettre au filtre de corps suivant sa propre version modifiée du bloc de données en appelant [[10-guides/04-njs/reference|r.sendBuffer()]]. Par exemple, pour transformer toutes les minuscules du corps de la réponse :

```nginx
function filter(r, data, flags) {
    r.sendBuffer(data.toLowerCase(), flags);
}
```

Si la fonction de filtre modifie la longueur du corps de la réponse, l'en-tête de réponse `Content-Length` (s'il est présent) doit être supprimé dans [[12-directives/js-header-filter|js_header_filter]] pour imposer l'encodage de transfert par morceaux :

```nginx
example.conf:
 location /foo {
     # proxy_pass http://localhost:8080;

    js_header_filter main.clear_content_length;
    js_body_filter   main.filter;
 }

example.js:
 function clear_content_length(r) {
     delete r.headersOut['Content-Length'];
 }
```

Pour arrêter le filtrage et transmettre les blocs de données au client sans appeler `js_body_filter`, on peut utiliser [[10-guides/04-njs/reference|r.done()]]. Par exemple, pour ajouter des données au début du corps de la réponse :

```nginx
function prepend(r, data, flags) {
    r.sendBuffer("XXX");
    r.sendBuffer(data, flags);
    r.done();
}
```

> [!NOTE]
> Comme le gestionnaire `js_body_filter` renvoie son résultat immédiatement, il ne prend en charge que les opérations synchrones. Les opérations asynchrones comme [[10-guides/04-njs/reference|r.subrequest()]] ou [[10-guides/04-njs/reference|setTimeout()]] ne sont donc pas prises en charge.

> [!NOTE]
> La directive peut être indiquée dans un bloc [[12-directives/if|if]] depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
