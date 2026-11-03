---
title: "allow (ngx_http_access_module)"
description: "Directive nginx allow (ngx_http_access_module) — Allows access for the specified network or address. If the special value unix: is specified (1.5.1), allows access for all UNIX-domain sockets. Several allow directives can be specified on the same…"
tags: [nginx, directive, ngx_http_access_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `allow address \| CIDR \| unix: \| all;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_access_module\|ngx_http_access_module]] |

## Utilisation

Allows access for the specified network or address. If the special value `unix:` is specified (1.5.1), allows access for all UNIX-domain sockets.

Several `allow` directives can be specified on the same level. These directives are inherited from the previous configuration level if and only if there are no `allow` and `deny` directives defined on the current level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
