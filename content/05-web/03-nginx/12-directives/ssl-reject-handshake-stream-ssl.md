---
title: "ssl_reject_handshake (ngx_stream_ssl_module)"
description: "Directive nginx ssl_reject_handshake (ngx_stream_ssl_module) — Si cette option est activée, les négociations SSL dans le bloc server sont rejetées. Par exemple, dans la configuration suivante, les négociations SSL avec un nom de serveur autre que example.com…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_reject_handshake on \| off;` |
| **Valeur par défaut** | `ssl_reject_handshake off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.25.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Si cette option est activée, les négociations SSL dans le bloc [[12-directives/server-stream-core|server]] sont rejetées.

Par exemple, dans la configuration suivante, les négociations SSL avec un nom de serveur autre que `example.com` sont rejetées :

```nginx
server {
    listen               443 ssl default_server;
    ssl_reject_handshake on;
}

server {
    listen              443 ssl;
    server_name         example.com;
    ssl_certificate     example.com.crt;
    ssl_certificate_key example.com.key;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
