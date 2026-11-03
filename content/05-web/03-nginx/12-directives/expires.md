---
title: "expires"
description: "Directive nginx expires (ngx_http_headers_module) — Active ou désactive l'ajout ou la modification des champs d'en-tête de réponse Expires et Cache-Control si le code de réponse vaut 200, 201 (1.3.10), 204, 206, 301, 302, 303, 304, 307 (1.1.16,…"
tags: [nginx, directive, ngx_http_headers_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `expires [modified] time;` ou `expires epoch \| max \| off;` |
| **Valeur par défaut** | `expires off;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_headers_module\|ngx_http_headers_module]] |

## Utilisation

Active ou désactive l'ajout ou la modification des champs d'en-tête de réponse `Expires` et `Cache-Control` si le code de réponse vaut 200, 201 (1.3.10), 204, 206, 301, 302, 303, 304, 307 (1.1.16, 1.0.13) ou 308 (1.13.0). Le paramètre peut être une [[10-guides/01-introduction/syntax|durée]] positive ou négative.

L'heure du champ `Expires` est calculée en ajoutant à l'heure actuelle la durée (*time*) indiquée dans la directive. Avec le paramètre `modified` (0.7.0, 0.6.32), elle est calculée en ajoutant cette durée à la date de modification du fichier.

Il est aussi possible d'indiquer une heure de la journée avec le préfixe « `@` » (0.7.9, 0.6.34) :

```nginx
expires @15h30m;
```

Le contenu du champ `Cache-Control` dépend du signe de la durée indiquée :

- durée négative : `Cache-Control: no-cache`.
- durée positive ou nulle : `Cache-Control: max-age=t`, où *t* est la durée indiquée dans la directive, en secondes.

Le paramètre `epoch` donne à `Expires` la valeur « `Thu, 01 Jan 1970 00:00:01 GMT` » et à `Cache-Control` la valeur « `no-cache` ».

Le paramètre `max` donne à `Expires` la valeur « `Thu, 31 Dec 2037 23:55:55 GMT` » et règle `Cache-Control` sur 10 ans.

Le paramètre `off` désactive l'ajout ou la modification des champs d'en-tête de réponse `Expires` et `Cache-Control`.

La valeur du dernier paramètre peut contenir des variables (1.7.9) :

```nginx
map $sent_http_content_type $expires {
    default         off;
    application/pdf 42d;
    ~image/         max;
}

expires $expires;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
