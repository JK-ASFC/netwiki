---
title: "ngx_http_sub_module"
description: "Module nginx ngx_http_sub_module — Le module ngx_http_sub_module est un filtre qui modifie une réponse en remplaçant une chaîne par une autre."
tags: [nginx, module, ngx_http_sub_module]
icon: puzzle
---

Le module `ngx_http_sub_module` est un filtre qui modifie une réponse en remplaçant une chaîne par une autre.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_sub_module`.

## Exemple de configuration

```nginx
location / {
    sub_filter '<a href="http://127.0.0.1:8080/'  '<a href="https://$host/';
    sub_filter '<img src="http://127.0.0.1:8080/' '<img src="https://$host/';
    sub_filter_once on;
}
```

## Directives

- [[12-directives/sub-filter|sub_filter]]
- [[12-directives/sub-filter-last-modified|sub_filter_last_modified]]
- [[12-directives/sub-filter-once|sub_filter_once]]
- [[12-directives/sub-filter-types|sub_filter_types]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
