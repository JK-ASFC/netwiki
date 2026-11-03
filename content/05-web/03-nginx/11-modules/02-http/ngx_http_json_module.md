---
title: "ngx_http_json_module"
description: "Module nginx ngx_http_json_module — The ngx_http_json_module module (1.31.5) extracts values from a JSON document stored in a variable and makes them available as variables."
tags: [nginx, module, ngx_http_json_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_json_module` module (1.31.5) extracts values from a JSON document stored in a variable and makes them available as variables.

A document is parsed only once per request, no matter how many variables are extracted from it. Parsing is performed on the first access to any of these variables.

This module is not built by default, it should be enabled with the `--with-http_json_module` configuration parameter.

## Exemple de configuration

```nginx
http {
    json_set $user_name $arg_data user.name;
    json_set $user_age  $arg_data user.age;
    json_set $tag0      $arg_data tags[0];

    server {
        listen 8080;

        location / {
            return 200 "name=$user_name age=$user_age tag0=$tag0\n";
        }
    }
}
```

## Directives

- [[12-directives/json-max-depth|json_max_depth]]
- [[12-directives/json-set|json_set]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
