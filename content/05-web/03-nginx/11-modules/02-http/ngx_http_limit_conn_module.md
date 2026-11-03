---
title: "ngx_http_limit_conn_module"
description: "Module nginx ngx_http_limit_conn_module — Le module ngx_http_limit_conn_module sert à limiter le nombre de connexions par clé définie, en particulier le nombre de connexions provenant d'une même adresse IP."
tags: [nginx, module, ngx_http_limit_conn_module]
icon: puzzle
---

Le module `ngx_http_limit_conn_module` sert à limiter le nombre de connexions par clé définie, en particulier le nombre de connexions provenant d'une même adresse IP.

Toutes les connexions ne sont pas comptées : une connexion n'est comptée que si une requête est en cours de traitement par le serveur et que tout l'en-tête de la requête a déjà été lu.

## Exemple de configuration

```nginx
http {
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    ...

    server {

        ...

        location /download/ {
            limit_conn addr 1;
        }
```

## Directives

- [[12-directives/limit-conn-http-limit-conn|limit_conn]]
- [[12-directives/limit-conn-dry-run-http-limit-conn|limit_conn_dry_run]]
- [[12-directives/limit-conn-log-level-http-limit-conn|limit_conn_log_level]]
- [[12-directives/limit-conn-status|limit_conn_status]]
- [[12-directives/limit-conn-zone-http-limit-conn|limit_conn_zone]]
- [[12-directives/limit-zone|limit_zone]]

## Variables intégrées

- [[13-variables/limit-conn-status-http-limit-conn|$limit_conn_status]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
