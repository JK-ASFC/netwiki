---
title: "ngx_stream_return_module"
description: "Module nginx ngx_stream_return_module — The ngx_stream_return_module module (1.11.2) allows sending a specified value to the client and then closing the connection."
tags: [nginx, module, ngx_stream_return_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_return_module` module (1.11.2) allows sending a specified value to the client and then closing the connection.

## Exemple de configuration

```nginx
server {
    listen 12345;
    return $time_iso8601;
}
```

## Directives

- [[12-directives/return-stream-return|return]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
