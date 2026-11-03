---
title: "fastcgi_index"
description: "Directive nginx fastcgi_index (ngx_http_fastcgi_module) — Définit le nom de fichier ajouté après un URI se terminant par une barre oblique, dans la valeur de la variable $fastcgi_script_name. Par exemple, avec ces réglages nginx fastcgi_index index.php;…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_index name;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit le nom de fichier ajouté après un URI se terminant par une barre oblique, dans la valeur de la variable `$fastcgi_script_name`. Par exemple, avec ces réglages

```nginx
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME /home/www/scripts/php$fastcgi_script_name;
```

et la requête « `/page.php` », le paramètre `SCRIPT_FILENAME` vaut « `/home/www/scripts/php/page.php` » ; avec la requête « `/` », il vaut « `/home/www/scripts/php/index.php` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
