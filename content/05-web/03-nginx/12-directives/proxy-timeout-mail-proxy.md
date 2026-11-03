---
title: "proxy_timeout (ngx_mail_proxy_module)"
description: "Directive nginx proxy_timeout (ngx_mail_proxy_module) — Sets the timeout between two successive read or write operations on client or proxied server connections. If no data is transmitted within this time, the connection is closed."
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_timeout timeout;` |
| **Valeur par défaut** | `proxy_timeout 24h;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Sets the *timeout* between two successive read or write operations on client or proxied server connections. If no data is transmitted within this time, the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
