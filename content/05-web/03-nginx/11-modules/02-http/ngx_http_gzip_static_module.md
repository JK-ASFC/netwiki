---
title: "ngx_http_gzip_static_module"
description: "Module nginx ngx_http_gzip_static_module — Le module ngx_http_gzip_static_module permet d'envoyer des fichiers précompressés portant l'extension « .gz » à la place des fichiers ordinaires."
tags: [nginx, module, ngx_http_gzip_static_module]
icon: puzzle
---

Le module `ngx_http_gzip_static_module` permet d'envoyer des fichiers précompressés portant l'extension « `.gz` » à la place des fichiers ordinaires.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_gzip_static_module`.

## Exemple de configuration

```nginx
gzip_static  on;
gzip_proxied expired no-cache no-store private auth;
```

## Directives

- [[12-directives/gzip-static|gzip_static]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
