---
title: "proxy_protocol (ngx_mail_proxy_module)"
description: "Directive nginx proxy_protocol (ngx_mail_proxy_module) — Enables the PROXY protocol for connections to a backend. The on parameter enables version 1 of the PROXY protocol (text format). The v2 parameter (1.31.4) enables version 2 of the PROXY protocol…"
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_protocol on \| off \| v2;` |
| **Valeur par défaut** | `proxy_protocol off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.19.8 |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Enables the [PROXY protocol](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) for connections to a backend. The `on` parameter enables version 1 of the PROXY protocol (text format). The `v2` parameter (1.31.4) enables version 2 of the PROXY protocol (binary format).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
