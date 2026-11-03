---
title: "ngx_stream_split_clients_module"
description: "Module nginx ngx_stream_split_clients_module — The ngx_stream_split_clients_module module (1.11.3) creates variables suitable for A/B testing, also known as split testing."
tags: [nginx, module, ngx_stream_split_clients_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_split_clients_module` module (1.11.3) creates variables suitable for A/B testing, also known as split testing.

## Example Configuration

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
