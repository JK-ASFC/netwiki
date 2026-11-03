---
title: "ssl_reject_handshake (ngx_http_ssl_module)"
description: "Directive nginx ssl_reject_handshake (ngx_http_ssl_module) — If enabled, SSL handshakes in the server block will be rejected. For example, in the following configuration, SSL handshakes with server names other than example.com are rejected: nginx server {…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_reject_handshake on \| off;` |
| **Valeur par défaut** | `ssl_reject_handshake off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

If enabled, SSL handshakes in the [[12-directives/server-http-core|server]] block will be rejected.

For example, in the following configuration, SSL handshakes with server names other than `example.com` are rejected:

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
