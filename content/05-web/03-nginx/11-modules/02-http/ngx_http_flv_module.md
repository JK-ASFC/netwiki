---
title: "ngx_http_flv_module"
description: "Module nginx ngx_http_flv_module — Le module ngx_http_flv_module fournit côté serveur la prise en charge de la pseudo-diffusion en continu des fichiers Flash Video (FLV)."
tags: [nginx, module, ngx_http_flv_module]
icon: puzzle
---

Le module `ngx_http_flv_module` fournit côté serveur la prise en charge de la pseudo-diffusion en continu des fichiers Flash Video (FLV).

Il traite de façon particulière les requêtes dont la chaîne de requête de l'URI contient l'argument `start` : il renvoie le contenu du fichier à partir du décalage en octets demandé, précédé de l'en-tête FLV.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_flv_module`.

## Exemple de configuration

```nginx
location ~ \.flv$ {
    flv;
}
```

## Directives

- [[12-directives/flv|flv]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
