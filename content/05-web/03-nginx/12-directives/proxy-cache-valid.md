---
title: "proxy_cache_valid"
description: "Directive nginx proxy_cache_valid (ngx_http_proxy_module) — Définit la durée de mise en cache selon le code de réponse. Par exemple, les directives suivantes nginx proxy_cache_valid 200 302 10m; proxy_cache_valid 404 1m; mettent en cache pendant 10 minutes…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_valid [code ...] time;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit la durée de mise en cache selon le code de réponse. Par exemple, les directives suivantes

```nginx
proxy_cache_valid 200 302 10m;
proxy_cache_valid 404      1m;
```

mettent en cache pendant 10 minutes les réponses de code 200 et 302, et pendant 1 minute celles de code 404.

Si seule la durée (*time*) de mise en cache est indiquée

```nginx
proxy_cache_valid 5m;
```

seules les réponses 200, 301 et 302 sont mises en cache.

On peut aussi indiquer le paramètre `any` pour mettre en cache toutes les réponses :

```nginx
proxy_cache_valid 200 302 10m;
proxy_cache_valid 301      1h;
proxy_cache_valid any      1m;
```

Les paramètres de mise en cache peuvent aussi être définis directement dans l'en-tête de la réponse. Cela a priorité sur la durée définie par la directive.

- Le champ d'en-tête `X-Accel-Expires` définit la durée de mise en cache de la réponse, en secondes. La valeur zéro désactive la mise en cache de la réponse. Si la valeur commence par le préfixe `@`, elle indique une date absolue, en secondes depuis l'Epoch, jusqu'à laquelle la réponse peut être mise en cache.

- Si l'en-tête ne contient pas le champ `X-Accel-Expires`, les paramètres de mise en cache peuvent être définis dans les champs `Expires` ou `Cache-Control`.

- Si l'en-tête contient le champ `Set-Cookie`, la réponse n'est pas mise en cache.

- Si l'en-tête contient le champ `Vary` avec la valeur spéciale « `*` », la réponse n'est pas mise en cache (1.7.7). S'il contient le champ `Vary` avec une autre valeur, la réponse est mise en cache en tenant compte des champs d'en-tête de requête correspondants (1.7.7).

Le traitement d'un ou plusieurs de ces champs d'en-tête de réponse peut être désactivé avec la directive [[12-directives/proxy-ignore-headers|proxy_ignore_headers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
