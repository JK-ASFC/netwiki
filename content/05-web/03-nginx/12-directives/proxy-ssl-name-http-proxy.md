---
title: "proxy_ssl_name (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_name (ngx_http_proxy_module) — Allows overriding the server name used to verify the certificate of the proxied HTTPS server and to be passed through SNI when establishing a connection with the proxied HTTPS server. By default, the…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_name name;` |
| **Valeur par défaut** | `proxy_ssl_name $proxy_host;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Allows overriding the server name used to [[12-directives/proxy-ssl-verify-http-proxy|verify]] the certificate of the proxied HTTPS server and to be [[12-directives/proxy-ssl-server-name-http-proxy|passed through SNI]] when establishing a connection with the proxied HTTPS server.

By default, the host part of the [[12-directives/proxy-pass-http-proxy|proxy_pass]] URL is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
