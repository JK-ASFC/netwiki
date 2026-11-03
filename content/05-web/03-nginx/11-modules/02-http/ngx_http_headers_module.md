---
title: "ngx_http_headers_module"
description: "Module nginx ngx_http_headers_module — Le module ngx_http_headers_module permet d'ajouter à l'en-tête de réponse les champs Expires et Cache-Control, ainsi que des champs quelconques."
tags: [nginx, module, ngx_http_headers_module]
icon: puzzle
---

Le module `ngx_http_headers_module` permet d'ajouter à l'en-tête de réponse les champs `Expires` et `Cache-Control`, ainsi que des champs quelconques.

## Exemple de configuration

```nginx
expires    24h;
expires    modified +24h;
expires    @24h;
expires    0;
expires    -1;
expires    epoch;
expires    $expires;
add_header Cache-Control private;
```

## Directives

- [[12-directives/add-header|add_header]]
- [[12-directives/add-header-inherit|add_header_inherit]]
- [[12-directives/add-trailer|add_trailer]]
- [[12-directives/add-trailer-inherit|add_trailer_inherit]]
- [[12-directives/expires|expires]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
