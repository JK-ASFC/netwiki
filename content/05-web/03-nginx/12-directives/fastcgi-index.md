---
title: "fastcgi_index"
description: "Directive nginx fastcgi_index (ngx_http_fastcgi_module) — Sets a file name that will be appended after a URI that ends with a slash, in the value of the $fastcgi_script_name variable. For example, with these settings nginx fastcgi_index index.php;…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_index name;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Sets a file name that will be appended after a URI that ends with a slash, in the value of the `$fastcgi_script_name` variable. For example, with these settings

```nginx
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME /home/www/scripts/php$fastcgi_script_name;
```

and the “`/page.php`” request, the `SCRIPT_FILENAME` parameter will be equal to “`/home/www/scripts/php/page.php`”, and with the “`/`” request it will be equal to “`/home/www/scripts/php/index.php`”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
