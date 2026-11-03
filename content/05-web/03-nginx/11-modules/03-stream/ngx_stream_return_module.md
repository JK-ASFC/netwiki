---
title: "ngx_stream_return_module"
description: "Module nginx ngx_stream_return_module — Le module ngx_stream_return_module (1.11.2) permet d'envoyer une valeur donnée au client, puis de fermer la connexion."
tags: [nginx, module, ngx_stream_return_module]
icon: puzzle
---

Le module `ngx_stream_return_module` (1.11.2) permet d'envoyer une valeur donnée au client, puis de fermer la connexion.

## Exemple de configuration

```nginx
server {
    listen 12345;
    return $time_iso8601;
}
```

## Directives

- [[12-directives/return-stream-return|return]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
