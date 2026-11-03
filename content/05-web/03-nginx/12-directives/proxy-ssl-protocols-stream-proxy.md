---
title: "proxy_ssl_protocols (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_protocols (ngx_stream_proxy_module) — Enables the specified protocols for connections to a proxied server. NOTE Le paramètre TLSv1.3 est utilisé par défaut depuis la version 1.23.4."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_protocols [SSLv2] [SSLv3] [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `proxy_ssl_protocols TLSv1.2 TLSv1.3;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Enables the specified protocols for connections to a proxied server.

> [!NOTE]
> Le paramètre `TLSv1.3` est utilisé par défaut depuis la version 1.23.4.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
