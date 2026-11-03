---
title: "ngx_http_slice_module"
description: "Module nginx ngx_http_slice_module — Le module ngx_http_slice_module (1.9.8) est un filtre qui découpe une requête en sous-requêtes renvoyant chacune une plage de la réponse. Il permet une mise en cache plus efficace des grosses réponses."
tags: [nginx, module, ngx_http_slice_module]
icon: puzzle
---

Le module `ngx_http_slice_module` (1.9.8) est un filtre qui découpe une requête en sous-requêtes renvoyant chacune une plage de la réponse. Il permet une mise en cache plus efficace des grosses réponses.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_slice_module`.

## Problèmes connus

Actuellement, le module ne fonctionne pas comme prévu dans les sous-requêtes comme la [[12-directives/proxy-cache-background-update|mise à jour du cache en arrière-plan]] : la requête est alors construite sans prise en charge des plages d'octets.

## Exemple de configuration

```nginx
location / {
    slice             1m;
    proxy_cache       cache;
    proxy_cache_key   $uri$is_args$args$slice_range;
    proxy_set_header  Range $slice_range;
    proxy_cache_valid 200 206 1h;
    proxy_pass        http://localhost:8000;
}
```

Dans cet exemple, la réponse est découpée en tranches d'un mégaoctet pouvant être mises en cache.

## Directives

- [[12-directives/slice|slice]]

## Variables intégrées

- [[13-variables/slice-range|$slice_range]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
