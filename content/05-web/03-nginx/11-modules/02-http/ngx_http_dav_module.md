---
title: "ngx_http_dav_module"
description: "Module nginx ngx_http_dav_module — The ngx_http_dav_module module is intended for file management automation via the WebDAV protocol. The module processes HTTP and WebDAV methods PUT, DELETE, MKCOL, COPY, and MOVE."
tags: [nginx, module, ngx_http_dav_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_dav_module` module is intended for file management automation via the WebDAV protocol. The module processes HTTP and WebDAV methods PUT, DELETE, MKCOL, COPY, and MOVE.

This module is not built by default, it should be enabled with the `--with-http_dav_module` configuration parameter.

> [!NOTE]
> WebDAV clients that require additional WebDAV methods to operate will not work with this module.

## Exemple de configuration

```nginx
location / {
    root                  /data/www;

    client_body_temp_path /data/client_temp;

    dav_methods PUT DELETE MKCOL COPY MOVE;

    create_full_put_path  on;
    dav_access            group:rw  all:r;

    limit_except GET {
        allow 192.168.1.0/32;
        deny  all;
    }
}
```

## Directives

- [[12-directives/create-full-put-path|create_full_put_path]]
- [[12-directives/dav-access|dav_access]]
- [[12-directives/dav-methods|dav_methods]]
- [[12-directives/min-delete-depth|min_delete_depth]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
