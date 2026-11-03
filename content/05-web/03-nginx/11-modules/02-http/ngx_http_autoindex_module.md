---
title: "ngx_http_autoindex_module"
description: "Module nginx ngx_http_autoindex_module — Le module ngx_http_autoindex_module traite les requêtes se terminant par une barre oblique (‘/’) et produit la liste du contenu du répertoire. Une requête est généralement transmise à ce module lorsque le module…"
tags: [nginx, module, ngx_http_autoindex_module]
icon: puzzle
---

Le module `ngx_http_autoindex_module` traite les requêtes se terminant par une barre oblique (‘`/`’) et produit la liste du contenu du répertoire. Une requête est généralement transmise à ce module lorsque le module [[11-modules/02-http/ngx_http_index_module|ngx_http_index_module]] ne trouve pas de fichier d'index.

## Exemple de configuration

```nginx
location / {
    autoindex on;
}
```

## Directives

- [[12-directives/autoindex|autoindex]]
- [[12-directives/autoindex-exact-size|autoindex_exact_size]]
- [[12-directives/autoindex-format|autoindex_format]]
- [[12-directives/autoindex-localtime|autoindex_localtime]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
