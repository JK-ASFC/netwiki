---
title: "ngx_http_random_index_module"
description: "Module nginx ngx_http_random_index_module — Le module ngx_http_random_index_module traite les requêtes se terminant par une barre oblique (‘/’) et choisit au hasard un fichier du répertoire comme fichier d'index. Il est traité avant le module…"
tags: [nginx, module, ngx_http_random_index_module]
icon: puzzle
---

Le module `ngx_http_random_index_module` traite les requêtes se terminant par une barre oblique (‘`/`’) et choisit au hasard un fichier du répertoire comme fichier d'index. Il est traité avant le module [[11-modules/02-http/ngx_http_index_module|ngx_http_index_module]].

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_random_index_module`.

## Exemple de configuration

```nginx
location / {
    random_index on;
}
```

## Directives

- [[12-directives/random-index|random_index]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
