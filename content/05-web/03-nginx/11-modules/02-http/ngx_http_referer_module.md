---
title: "ngx_http_referer_module"
description: "Module nginx ngx_http_referer_module — Le module ngx_http_referer_module sert à bloquer l'accès à un site pour les requêtes dont le champ d'en-tête Referer a une valeur non valide. Il est assez facile de fabriquer une requête avec un champ Referer approprié…"
tags: [nginx, module, ngx_http_referer_module]
icon: puzzle
---

Le module `ngx_http_referer_module` sert à bloquer l'accès à un site pour les requêtes dont le champ d'en-tête `Referer` a une valeur non valide. Il est assez facile de fabriquer une requête avec un champ `Referer` approprié : le but de ce module n'est donc pas de bloquer complètement ces requêtes, mais le flux massif de requêtes envoyées par des navigateurs ordinaires. Les navigateurs ordinaires peuvent aussi ne pas envoyer de champ `Referer`, même pour des requêtes valides.

## Exemple de configuration

```nginx
valid_referers none blocked server_names
               *.example.com example.* www.example.org/galleries/
               ~\.google\.;

if ($invalid_referer) {
    return 403;
}
```

## Directives

- [[12-directives/referer-hash-bucket-size|referer_hash_bucket_size]]
- [[12-directives/referer-hash-max-size|referer_hash_max_size]]
- [[12-directives/valid-referers|valid_referers]]

## Variables intégrées

- [[13-variables/invalid-referer|$invalid_referer]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
