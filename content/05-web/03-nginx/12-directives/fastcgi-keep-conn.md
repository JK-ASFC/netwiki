---
title: "fastcgi_keep_conn"
description: "Directive nginx fastcgi_keep_conn (ngx_http_fastcgi_module) — By default, a FastCGI server will close a connection right after sending the response. However, when this directive is set to the value on, nginx will instruct a FastCGI server to keep connections…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_keep_conn on \| off;` |
| **Valeur par défaut** | `fastcgi_keep_conn off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.4 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

By default, a FastCGI server will close a connection right after sending the response. However, when this directive is set to the value `on`, nginx will instruct a FastCGI server to keep connections open. This is necessary, in particular, for [[12-directives/keepalive|keepalive]] connections to FastCGI servers to function.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
