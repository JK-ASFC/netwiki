---
title: "scgi_limit_rate"
description: "Directive nginx scgi_limit_rate (ngx_http_scgi_module) — Limits the speed of reading the response from the SCGI server. The rate is specified in bytes per second. The zero value disables rate limiting. The limit is set per a request, and so if nginx…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_limit_rate rate;` |
| **Valeur par défaut** | `scgi_limit_rate 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.7 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Limits the speed of reading the response from the SCGI server. The *rate* is specified in bytes per second. The zero value disables rate limiting. The limit is set per a request, and so if nginx simultaneously opens two connections to the SCGI server, the overall rate will be twice as much as the specified limit. The limitation works only if [[12-directives/scgi-buffering|buffering]] of responses from the SCGI server is enabled. Parameter value can contain variables (1.27.0).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
