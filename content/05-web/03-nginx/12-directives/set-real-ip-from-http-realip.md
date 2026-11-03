---
title: "set_real_ip_from (ngx_http_realip_module)"
description: "Directive nginx set_real_ip_from (ngx_http_realip_module) — Defines trusted addresses that are known to send correct replacement addresses. If the special value unix: is specified, all UNIX-domain sockets will be trusted. Trusted addresses may also be…"
tags: [nginx, directive, ngx_http_realip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `set_real_ip_from address \| CIDR \| unix:;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_realip_module\|ngx_http_realip_module]] |

## Utilisation

Defines trusted addresses that are known to send correct replacement addresses. If the special value `unix:` is specified, all UNIX-domain sockets will be trusted. Trusted addresses may also be specified using a hostname (1.13.1).

> [!NOTE]
> IPv6 addresses are supported starting from versions 1.3.0 and 1.2.1.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
