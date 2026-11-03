---
title: "ngx_stream_set_module"
description: "Module nginx ngx_stream_set_module — Le module ngx_stream_set_module (1.19.3) permet d'affecter une valeur à une variable."
tags: [nginx, module, ngx_stream_set_module]
icon: puzzle
---

Le module `ngx_stream_set_module` (1.19.3) permet d'affecter une valeur à une variable.

## Exemple de configuration

```nginx
server {
    listen 12345;
    set    $true 1;
}
```

## Directives

- [[12-directives/set-stream-set|set]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
