---
title: "fastcgi_split_path_info"
description: "Directive nginx fastcgi_split_path_info (ngx_http_fastcgi_module) — Defines a regular expression that captures a value for the $fastcgi_path_info variable. The regular expression should have two captures: the first becomes a value of the $fastcgi_script_name…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_split_path_info regex;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Defines a regular expression that captures a value for the `$fastcgi_path_info` variable. The regular expression should have two captures: the first becomes a value of the `$fastcgi_script_name` variable, the second becomes a value of the `$fastcgi_path_info` variable. For example, with these settings

```nginx
location ~ ^(.+\.php)(.*)$ {
    fastcgi_split_path_info       ^(.+\.php)(.*)$;
    fastcgi_param SCRIPT_FILENAME /path/to/php$fastcgi_script_name;
    fastcgi_param PATH_INFO       $fastcgi_path_info;
```

and the “`/show.php/article/0001`” request, the `SCRIPT_FILENAME` parameter will be equal to “`/path/to/php/show.php`”, and the `PATH_INFO` parameter will be equal to “`/article/0001`”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
