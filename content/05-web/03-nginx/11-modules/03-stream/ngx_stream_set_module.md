---
title: "ngx_stream_set_module"
description: "Module nginx ngx_stream_set_module — The ngx_stream_set_module module (1.19.3) allows setting a value for a variable."
tags: [nginx, module, ngx_stream_set_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_set_module` module (1.19.3) allows setting a value for a variable.

## Exemple de configuration

```nginx
server {
    listen 12345;
    set    $true 1;
}
```

## Directives

- [[12-directives/set-stream-set|set]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
