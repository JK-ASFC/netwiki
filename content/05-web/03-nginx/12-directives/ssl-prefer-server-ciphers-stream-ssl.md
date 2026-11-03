---
title: "ssl_prefer_server_ciphers (ngx_stream_ssl_module)"
description: "Directive nginx ssl_prefer_server_ciphers (ngx_stream_ssl_module) — Specifies that server ciphers should be preferred over client ciphers when the SSLv3 and TLS protocols are used."
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_prefer_server_ciphers on \| off;` |
| **Valeur par défaut** | `ssl_prefer_server_ciphers off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Specifies that server ciphers should be preferred over client ciphers when the SSLv3 and TLS protocols are used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
