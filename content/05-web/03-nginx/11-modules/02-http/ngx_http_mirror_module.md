---
title: "ngx_http_mirror_module"
description: "Module nginx ngx_http_mirror_module — Le module ngx_http_mirror_module (1.13.4) duplique la requête d'origine en créant des sous-requêtes miroirs en arrière-plan. Les réponses aux sous-requêtes miroirs sont ignorées."
tags: [nginx, module, ngx_http_mirror_module]
icon: puzzle
---

Le module `ngx_http_mirror_module` (1.13.4) duplique la requête d'origine en créant des sous-requêtes miroirs en arrière-plan. Les réponses aux sous-requêtes miroirs sont ignorées.

## Exemple de configuration

```nginx
location / {
    mirror /mirror;
    proxy_pass http://backend;
}

location = /mirror {
    internal;
    proxy_pass http://test_backend$request_uri;
}
```

## Directives

- [[12-directives/mirror|mirror]]
- [[12-directives/mirror-request-body|mirror_request_body]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
