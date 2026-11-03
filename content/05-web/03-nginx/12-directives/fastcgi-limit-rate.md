---
title: "fastcgi_limit_rate"
description: "Directive nginx fastcgi_limit_rate (ngx_http_fastcgi_module) — Limits the speed of reading the response from the FastCGI server. The rate is specified in bytes per second. The zero value disables rate limiting. The limit is set per a request, and so if nginx…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_limit_rate rate;` |
| **Valeur par défaut** | `fastcgi_limit_rate 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.7 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Limits the speed of reading the response from the FastCGI server. The *rate* is specified in bytes per second. The zero value disables rate limiting. The limit is set per a request, and so if nginx simultaneously opens two connections to the FastCFI server, the overall rate will be twice as much as the specified limit. The limitation works only if [[12-directives/fastcgi-buffering|buffering]] of responses from the FastCGI server is enabled. Parameter value can contain variables (1.27.0).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
