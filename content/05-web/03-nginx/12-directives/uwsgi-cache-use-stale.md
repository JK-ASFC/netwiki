---
title: "uwsgi_cache_use_stale"
description: "Directive nginx uwsgi_cache_use_stale (ngx_http_uwsgi_module) — Determines in which cases a stale cached response can be used when an error occurs during communication with the uwsgi server. The directive’s parameters match the parameters of the…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_use_stale error \| timeout \| invalid_header \| updating \| http_500 \| http_503 \| http_403 \| http_404 \| http_429 \| off ...;` |
| **Valeur par défaut** | `uwsgi_cache_use_stale off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Determines in which cases a stale cached response can be used when an error occurs during communication with the uwsgi server. The directive’s parameters match the parameters of the [[12-directives/uwsgi-next-upstream|uwsgi_next_upstream]] directive.

The `error` parameter also permits using a stale cached response if a uwsgi server to process a request cannot be selected.

Additionally, the `updating` parameter permits using a stale cached response if it is currently being updated. This allows minimizing the number of accesses to uwsgi servers when updating cached data.

L'utilisation d'une réponse en cache périmée peut aussi être autorisée directement dans l'en-tête de réponse, pendant un nombre de secondes donné après sa péremption (1.11.10). Cela a une priorité inférieure à celle des paramètres de la directive.

- L'extension « [stale-while-revalidate](https://datatracker.ietf.org/doc/html/rfc5861#section-3) » du champ d'en-tête `Cache-Control` autorise l'utilisation d'une réponse en cache périmée pendant sa mise à jour.

- L'extension « [stale-if-error](https://datatracker.ietf.org/doc/html/rfc5861#section-4) » du champ d'en-tête `Cache-Control` autorise l'utilisation d'une réponse en cache périmée en cas d'erreur.

To minimize the number of accesses to uwsgi servers when populating a new cache element, the [[12-directives/uwsgi-cache-lock|uwsgi_cache_lock]] directive can be used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
