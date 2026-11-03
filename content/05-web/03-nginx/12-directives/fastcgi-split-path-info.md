---
title: "fastcgi_split_path_info"
description: "Directive nginx fastcgi_split_path_info (ngx_http_fastcgi_module) — Définit une expression régulière qui capture une valeur pour la variable $fastcgi_path_info. L'expression régulière doit avoir deux captures : la première devient la valeur de la variable…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_split_path_info regex;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit une expression régulière qui capture une valeur pour la variable `$fastcgi_path_info`. L'expression régulière doit avoir deux captures : la première devient la valeur de la variable `$fastcgi_script_name`, la seconde celle de `$fastcgi_path_info`. Par exemple, avec ces réglages

```nginx
location ~ ^(.+\.php)(.*)$ {
    fastcgi_split_path_info       ^(.+\.php)(.*)$;
    fastcgi_param SCRIPT_FILENAME /path/to/php$fastcgi_script_name;
    fastcgi_param PATH_INFO       $fastcgi_path_info;
```

et la requête « `/show.php/article/0001` », le paramètre `SCRIPT_FILENAME` vaut « `/path/to/php/show.php` » et le paramètre `PATH_INFO` vaut « `/article/0001` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
