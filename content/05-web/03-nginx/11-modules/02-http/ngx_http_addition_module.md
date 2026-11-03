---
title: "ngx_http_addition_module"
description: "Module nginx ngx_http_addition_module — Le module ngx_http_addition_module est un filtre qui ajoute du texte avant et après une réponse. Il n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration --with-http_addition_module."
tags: [nginx, module, ngx_http_addition_module]
icon: puzzle
---

Le module `ngx_http_addition_module` est un filtre qui ajoute du texte avant et après une réponse. Il n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_addition_module`.

## Exemple de configuration

```nginx
location / {
    add_before_body /before_action;
    add_after_body  /after_action;
}
```

## Directives

- [[12-directives/add-before-body|add_before_body]]
- [[12-directives/add-after-body|add_after_body]]
- [[12-directives/addition-types|addition_types]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
