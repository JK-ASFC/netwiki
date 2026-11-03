---
title: "$fastcgi_script_name"
description: "Variable nginx $fastcgi_script_name (ngx_http_fastcgi_module) — request URI or, if a URI ends with a slash, request URI with an index file name configured by the fastcgi_index directive appended to it. This variable can be used to set the SCRIPT_FILENAME and…"
tags: [nginx, variable, ngx_http_fastcgi_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$fastcgi_script_name` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

request URI or, if a URI ends with a slash, request URI with an index file name configured by the [[12-directives/fastcgi-index|fastcgi_index]] directive appended to it. This variable can be used to set the `SCRIPT_FILENAME` and `PATH_TRANSLATED` parameters that determine the script name in PHP. For example, for the “`/info/`” request with the following directives

```nginx
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME /home/www/scripts/php$fastcgi_script_name;
```

the `SCRIPT_FILENAME` parameter will be equal to “`/home/www/scripts/php/info/index.php`”.

When using the [[12-directives/fastcgi-split-path-info|fastcgi_split_path_info]] directive, the `$fastcgi_script_name` variable equals the value of the first capture set by the directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
