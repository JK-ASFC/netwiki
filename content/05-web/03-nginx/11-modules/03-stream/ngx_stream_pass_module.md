---
title: "ngx_stream_pass_module"
description: "Module nginx ngx_stream_pass_module — The ngx_stream_pass_module module (1.25.5) allows passing the accepted connection directly to any configured listening socket in http, stream, mail, and other similar modules."
tags: [nginx, module, ngx_stream_pass_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_pass_module` module (1.25.5) allows passing the accepted connection directly to any configured listening socket in `http`, `stream`, `mail`, and other similar modules.

## Example Configuration

```nginx
http {
    server {
        listen 8000;

        location / {
            root html;
        }
    }
}

stream {
    server {
        listen 12345 ssl;

        ssl_certificate     domain.crt;
        ssl_certificate_key domain.key;

        pass 127.0.0.1:8000;
    }
}
```

In the example, after terminating SSL/TLS in the `stream` module the connection is passed to the `http` module.

## Directives

- [[12-directives/pass|pass]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
