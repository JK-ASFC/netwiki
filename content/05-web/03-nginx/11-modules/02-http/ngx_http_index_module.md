---
title: "ngx_http_index_module"
description: "Module nginx ngx_http_index_module — Le module ngx_http_index_module traite les requêtes qui se terminent par une barre oblique (‘/’). Ces requêtes peuvent aussi être traitées par les modules ngx_http_autoindex_module et ngx_http_random_index_module."
tags: [nginx, module, ngx_http_index_module]
icon: puzzle
---

Le module `ngx_http_index_module` traite les requêtes qui se terminent par une barre oblique (‘`/`’). Ces requêtes peuvent aussi être traitées par les modules [[11-modules/02-http/ngx_http_autoindex_module|ngx_http_autoindex_module]] et [[11-modules/02-http/ngx_http_random_index_module|ngx_http_random_index_module]].

## Exemple de configuration

```nginx
location / {
    index index.$geo.html index.html;
}
```

## Directives

- [[12-directives/index|index]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
