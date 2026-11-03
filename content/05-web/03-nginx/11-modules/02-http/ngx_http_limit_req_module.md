---
title: "ngx_http_limit_req_module"
description: "Module nginx ngx_http_limit_req_module — Le module ngx_http_limit_req_module (0.7.21) sert à limiter le débit de traitement des requêtes par clé définie, en particulier le débit des requêtes provenant d'une même adresse IP. La limitation utilise la méthode du…"
tags: [nginx, module, ngx_http_limit_req_module]
icon: puzzle
---

Le module `ngx_http_limit_req_module` (0.7.21) sert à limiter le débit de traitement des requêtes par clé définie, en particulier le débit des requêtes provenant d'une même adresse IP. La limitation utilise la méthode du « seau percé » (*leaky bucket*).

## Exemple de configuration

```nginx
http {
    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

    ...

    server {

        ...

        location /search/ {
            limit_req zone=one burst=5;
        }
```

## Directives

- [[12-directives/limit-req|limit_req]]
- [[12-directives/limit-req-dry-run|limit_req_dry_run]]
- [[12-directives/limit-req-log-level|limit_req_log_level]]
- [[12-directives/limit-req-status|limit_req_status]]
- [[12-directives/limit-req-zone|limit_req_zone]]

## Variables intégrées

- [[13-variables/limit-req-status|$limit_req_status]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
