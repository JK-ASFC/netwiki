---
title: "ngx_http_addition_module"
description: "Module nginx ngx_http_addition_module — The ngx_http_addition_module module is a filter that adds text before and after a response. This module is not built by default, it should be enabled with the --with-http_addition_module configuration parameter."
tags: [nginx, module, ngx_http_addition_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_addition_module` module is a filter that adds text before and after a response. This module is not built by default, it should be enabled with the `--with-http_addition_module` configuration parameter.

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
