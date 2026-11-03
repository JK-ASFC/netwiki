---
title: "ngx_stream_access_module"
description: "Module nginx ngx_stream_access_module — Le module ngx_stream_access_module (1.9.2) permet de restreindre l'accès à certaines adresses client."
tags: [nginx, module, ngx_stream_access_module]
icon: puzzle
---

Le module `ngx_stream_access_module` (1.9.2) permet de restreindre l'accès à certaines adresses client.

## Exemple de configuration

```nginx
server {
    ...
    deny  192.168.1.1;
    allow 192.168.1.0/24;
    allow 10.1.1.0/16;
    allow 2001:0db8::/32;
    deny  all;
}
```

Les règles sont vérifiées dans l'ordre jusqu'à la première correspondance. Dans cet exemple, l'accès n'est autorisé que pour les réseaux IPv4 `10.1.1.0/16` et `192.168.1.0/24`, à l'exception de l'adresse `192.168.1.1`, et pour le réseau IPv6 `2001:0db8::/32`.

## Directives

- [[12-directives/allow-stream-access|allow]]
- [[12-directives/deny-stream-access|deny]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
