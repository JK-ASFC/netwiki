---
title: "set_real_ip_from (ngx_stream_realip_module)"
description: "Directive nginx set_real_ip_from (ngx_stream_realip_module) — Defines trusted addresses that are known to send correct replacement addresses. If the special value unix: is specified, all UNIX-domain sockets will be trusted."
tags: [nginx, directive, ngx_stream_realip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `set_real_ip_from address \| CIDR \| unix:;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_realip_module\|ngx_stream_realip_module]] |

## Utilisation

Defines trusted addresses that are known to send correct replacement addresses. If the special value `unix:` is specified, all UNIX-domain sockets will be trusted.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
