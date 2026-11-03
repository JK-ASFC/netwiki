---
title: "uwsgi_cache_use_stale"
description: "Directive nginx uwsgi_cache_use_stale (ngx_http_uwsgi_module) — Détermine dans quels cas une réponse en cache périmée peut être utilisée lorsqu'une erreur survient pendant la communication avec le serveur uwsgi. Les paramètres de la directive correspondent à ceux…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_use_stale error \| timeout \| invalid_header \| updating \| http_500 \| http_503 \| http_403 \| http_404 \| http_429 \| off ...;` |
| **Valeur par défaut** | `uwsgi_cache_use_stale off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Détermine dans quels cas une réponse en cache périmée peut être utilisée lorsqu'une erreur survient pendant la communication avec le serveur uwsgi. Les paramètres de la directive correspondent à ceux de la directive [[12-directives/uwsgi-next-upstream|uwsgi_next_upstream]].

Le paramètre `error` autorise aussi l'utilisation d'une réponse en cache périmée si aucun serveur uwsgi ne peut être choisi pour traiter la requête.

En outre, le paramètre `updating` autorise l'utilisation d'une réponse en cache périmée pendant sa mise à jour. Cela réduit le nombre d'accès aux serveurs uwsgi lors de la mise à jour des données en cache.

L'utilisation d'une réponse en cache périmée peut aussi être autorisée directement dans l'en-tête de réponse, pendant un nombre de secondes donné après sa péremption (1.11.10). Cela a une priorité inférieure à celle des paramètres de la directive.

- L'extension « [stale-while-revalidate](https://datatracker.ietf.org/doc/html/rfc5861#section-3) » du champ d'en-tête `Cache-Control` autorise l'utilisation d'une réponse en cache périmée pendant sa mise à jour.

- L'extension « [stale-if-error](https://datatracker.ietf.org/doc/html/rfc5861#section-4) » du champ d'en-tête `Cache-Control` autorise l'utilisation d'une réponse en cache périmée en cas d'erreur.

Pour réduire le nombre d'accès aux serveurs uwsgi lors de l'alimentation d'un nouvel élément de cache, on peut utiliser la directive [[12-directives/uwsgi-cache-lock|uwsgi_cache_lock]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
