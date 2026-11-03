---
title: "ngx_http_gunzip_module"
description: "Module nginx ngx_http_gunzip_module — Le module ngx_http_gunzip_module est un filtre qui décompresse les réponses portant « Content-Encoding: gzip » pour les clients qui ne prennent pas en charge la méthode d'encodage « gzip ». Il est utile lorsqu'on…"
tags: [nginx, module, ngx_http_gunzip_module]
icon: puzzle
---

Le module `ngx_http_gunzip_module` est un filtre qui décompresse les réponses portant « `Content-Encoding: gzip` » pour les clients qui ne prennent pas en charge la méthode d'encodage « gzip ». Il est utile lorsqu'on souhaite stocker les données compressées pour gagner de la place et réduire les entrées-sorties.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_gunzip_module`.

## Exemple de configuration

```nginx
location /storage/ {
    gunzip on;
    ...
}
```

## Directives

- [[12-directives/gunzip|gunzip]]
- [[12-directives/gunzip-buffers|gunzip_buffers]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
