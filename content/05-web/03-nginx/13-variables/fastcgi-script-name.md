---
title: "$fastcgi_script_name"
description: "Variable nginx $fastcgi_script_name (ngx_http_fastcgi_module) — URI de la requête ou, si l'URI se termine par une barre oblique, URI de la requête suivi du nom de fichier d'index défini par la directive fastcgi_index. Cette variable permet de définir les…"
tags: [nginx, variable, ngx_http_fastcgi_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$fastcgi_script_name` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

URI de la requête ou, si l'URI se termine par une barre oblique, URI de la requête suivi du nom de fichier d'index défini par la directive [[12-directives/fastcgi-index|fastcgi_index]]. Cette variable permet de définir les paramètres `SCRIPT_FILENAME` et `PATH_TRANSLATED`, qui déterminent le nom du script en PHP. Par exemple, pour la requête « `/info/` » avec les directives suivantes

```nginx
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME /home/www/scripts/php$fastcgi_script_name;
```

le paramètre `SCRIPT_FILENAME` vaut « `/home/www/scripts/php/info/index.php` ».

Avec la directive [[12-directives/fastcgi-split-path-info|fastcgi_split_path_info]], la variable `$fastcgi_script_name` prend la valeur de la première capture définie par la directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
