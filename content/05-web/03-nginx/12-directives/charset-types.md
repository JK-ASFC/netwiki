---
title: "charset_types"
description: "Directive nginx charset_types (ngx_http_charset_module) — Enables module processing in responses with the specified MIME types in addition to “text/html”. The special value “” matches any MIME type (0.8.29). NOTE Until version 1.5.4,…"
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `charset_types mime-type ...;` |
| **Valeur par défaut** | `charset_types text/html text/xml text/plain text/vnd.wap.wml application/javascript application/rss+xml;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.9 |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Enables module processing in responses with the specified MIME types in addition to “`text/html`”. The special value “`*`” matches any MIME type (0.8.29).

> [!NOTE]
> Until version 1.5.4, “`application/x-javascript`” was used as the default MIME type instead of “`application/javascript`”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
