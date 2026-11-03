---
title: "ngx_http_f4f_module"
description: "Module nginx ngx_http_f4f_module — Le module ngx_http_f4f_module fournit côté serveur la prise en charge d'Adobe HTTP Dynamic Streaming (HDS)."
tags: [nginx, module, ngx_http_f4f_module]
icon: puzzle
---

Le module `ngx_http_f4f_module` fournit côté serveur la prise en charge d'Adobe HTTP Dynamic Streaming (HDS).

Ce module traite les requêtes HTTP Dynamic Streaming de la forme « `/videoSeg1-Frag1` » en extrayant le fragment nécessaire du fichier `videoSeg1.f4f` à l'aide du fichier d'index `videoSeg1.f4x`. Il remplace le module f4f d'Adobe (HTTP Origin Module) pour Apache.

Le prétraitement habituel avec f4fpackager d'Adobe est nécessaire ; voir sa documentation pour les détails.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
location /video/ {
    f4f;
    ...
}
```

## Directives

- [[12-directives/f4f|f4f]]
- [[12-directives/f4f-buffer-size|f4f_buffer_size]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
