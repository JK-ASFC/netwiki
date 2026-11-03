---
title: "ngx_stream_split_clients_module"
description: "Module nginx ngx_stream_split_clients_module — Le module ngx_stream_split_clients_module (1.11.3) crée des variables adaptées aux tests A/B, aussi appelés tests fractionnés."
tags: [nginx, module, ngx_stream_split_clients_module]
icon: puzzle
---

Le module `ngx_stream_split_clients_module` (1.11.3) crée des variables adaptées aux tests A/B, aussi appelés tests fractionnés.

## Exemple de configuration

```nginx
stream {
    ...
    split_clients "${remote_addr}AAA" $upstream {
                  0.5%                feature_test1;
                  2.0%                feature_test2;
                  *                   production;
    }

    server {
        ...
        proxy_pass $upstream;
    }
}
```

## Directives

- [[12-directives/split-clients-stream-split-clients|split_clients]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
