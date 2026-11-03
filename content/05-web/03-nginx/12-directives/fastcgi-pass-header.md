---
title: "fastcgi_pass_header"
description: "Directive nginx fastcgi_pass_header (ngx_http_fastcgi_module) — Permits passing otherwise disabled header fields from a FastCGI server to a client."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_pass_header field;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Permits passing [[12-directives/fastcgi-hide-header|otherwise disabled]] header fields from a FastCGI server to a client.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
