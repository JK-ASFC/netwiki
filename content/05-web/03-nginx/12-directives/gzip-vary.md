---
title: "gzip_vary"
description: "Directive nginx gzip_vary (ngx_http_gzip_module) — Enables or disables inserting the Vary: Accept-Encoding response header field if the directives gzip, gzip_static, or gunzip are active."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_vary on \| off;` |
| **Valeur par défaut** | `gzip_vary off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Enables or disables inserting the `Vary: Accept-Encoding` response header field if the directives [[12-directives/gzip|gzip]], [[12-directives/gzip-static|gzip_static]], or [[12-directives/gunzip|gunzip]] are active.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
