---
title: "ngx_http_dav_module"
description: "Module nginx ngx_http_dav_module — Le module ngx_http_dav_module sert à automatiser la gestion de fichiers via le protocole WebDAV. Il traite les méthodes HTTP et WebDAV PUT, DELETE, MKCOL, COPY et MOVE."
tags: [nginx, module, ngx_http_dav_module]
icon: puzzle
---

Le module `ngx_http_dav_module` sert à automatiser la gestion de fichiers via le protocole WebDAV. Il traite les méthodes HTTP et WebDAV PUT, DELETE, MKCOL, COPY et MOVE.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_dav_module`.

> [!NOTE]
> Les clients WebDAV qui ont besoin d'autres méthodes WebDAV pour fonctionner ne marcheront pas avec ce module.

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
