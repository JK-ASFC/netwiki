---
title: "ngx_http_split_clients_module"
description: "Module nginx ngx_http_split_clients_module — The ngx_http_split_clients_module module creates variables suitable for A/B testing, also known as split testing."
tags: [nginx, module, ngx_http_split_clients_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_split_clients_module` module creates variables suitable for A/B testing, also known as split testing.

## Example Configuration

```nginx
http {
    split_clients "${remote_addr}AAA" $variant {
                   0.5%               .one;
                   2.0%               .two;
                   *                  "";
    }

    server {
        location / {
            index index${variant}.html;
```

## Directives

- [[12-directives/split-clients-http-split-clients|split_clients]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
