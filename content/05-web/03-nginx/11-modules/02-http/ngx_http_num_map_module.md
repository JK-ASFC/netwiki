---
title: "ngx_http_num_map_module"
description: "Module nginx ngx_http_num_map_module — Le module ngx_http_num_map_module (1.29.3) crée des variables dont la valeur dépend de valeurs numériques ou de plages de valeurs numériques."
tags: [nginx, module, ngx_http_num_map_module]
icon: puzzle
---

Le module `ngx_http_num_map_module` (1.29.3) crée des variables dont la valeur dépend de valeurs numériques ou de plages de valeurs numériques.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
num_map $remote_port $port_allow {
    default    0;

    80         1;
    443        1;
    <=1023     0;
    8080-8090  1;
}
```

## Directives

- [[12-directives/num-map-http-num-map|num_map]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
