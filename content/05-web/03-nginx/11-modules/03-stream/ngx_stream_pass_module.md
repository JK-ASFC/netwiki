---
title: "ngx_stream_pass_module"
description: "Module nginx ngx_stream_pass_module — Le module ngx_stream_pass_module (1.25.5) permet de passer la connexion acceptée directement à n'importe quelle socket d'écoute configurée dans les modules http, stream, mail et autres modules similaires."
tags: [nginx, module, ngx_stream_pass_module]
icon: puzzle
---

Le module `ngx_stream_pass_module` (1.25.5) permet de passer la connexion acceptée directement à n'importe quelle socket d'écoute configurée dans les modules `http`, `stream`, `mail` et autres modules similaires.

## Exemple de configuration

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

Dans cet exemple, après terminaison SSL/TLS dans le module `stream`, la connexion est passée au module `http`.

## Directives

- [[12-directives/pass|pass]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
