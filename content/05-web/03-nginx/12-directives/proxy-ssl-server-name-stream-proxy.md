---
title: "proxy_ssl_server_name (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_server_name (ngx_stream_proxy_module) — Enables or disables passing of the server name through TLS Server Name Indication extension (SNI, RFC 6066) when establishing a connection with the proxied server."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_server_name on \| off;` |
| **Valeur par défaut** | `proxy_ssl_server_name off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Enables or disables passing of the server name through [TLS Server Name Indication extension](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066) when establishing a connection with the proxied server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
