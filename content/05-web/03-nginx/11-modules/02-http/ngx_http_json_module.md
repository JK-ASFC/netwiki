---
title: "ngx_http_json_module"
description: "Module nginx ngx_http_json_module — Le module ngx_http_json_module (1.31.5) extrait des valeurs d'un document JSON stocké dans une variable et les rend disponibles sous forme de variables."
tags: [nginx, module, ngx_http_json_module]
icon: puzzle
---

Le module `ngx_http_json_module` (1.31.5) extrait des valeurs d'un document JSON stocké dans une variable et les rend disponibles sous forme de variables.

Le document n'est analysé qu'une fois par requête, quel que soit le nombre de variables extraites. L'analyse a lieu au premier accès à l'une de ces variables.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_json_module`.

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
