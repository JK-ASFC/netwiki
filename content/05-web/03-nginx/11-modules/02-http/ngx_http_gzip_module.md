---
title: "ngx_http_gzip_module"
description: "Module nginx ngx_http_gzip_module — Le module ngx_http_gzip_module est un filtre qui compresse les réponses avec la méthode « gzip ». Cela permet souvent de réduire de moitié, voire davantage, la taille des données transmises."
tags: [nginx, module, ngx_http_gzip_module]
icon: puzzle
---

Le module `ngx_http_gzip_module` est un filtre qui compresse les réponses avec la méthode « gzip ». Cela permet souvent de réduire de moitié, voire davantage, la taille des données transmises.

> [!NOTE]
> Avec le protocole SSL/TLS, les réponses compressées peuvent être exposées aux attaques [BREACH](https://en.wikipedia.org/wiki/BREACH).

## Exemple de configuration

```nginx
gzip            on;
gzip_min_length 1000;
gzip_proxied    expired no-cache no-store private auth;
gzip_types      text/plain application/xml;
```

La variable `$gzip_ratio` permet de journaliser le taux de compression obtenu.

## Directives

- [[12-directives/gzip|gzip]]
- [[12-directives/gzip-buffers|gzip_buffers]]
- [[12-directives/gzip-comp-level|gzip_comp_level]]
- [[12-directives/gzip-disable|gzip_disable]]
- [[12-directives/gzip-http-version|gzip_http_version]]
- [[12-directives/gzip-min-length|gzip_min_length]]
- [[12-directives/gzip-proxied|gzip_proxied]]
- [[12-directives/gzip-types|gzip_types]]
- [[12-directives/gzip-vary|gzip_vary]]

## Variables intégrées

- [[13-variables/gzip-ratio|$gzip_ratio]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
