---
title: "proxy_buffer"
description: "Directive nginx proxy_buffer (ngx_mail_proxy_module) — Sets the size of the buffer used for proxying. By default, the buffer size is equal to one memory page. Depending on a platform, it is either 4K or 8K."
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_buffer size;` |
| **Valeur par défaut** | `proxy_buffer 4k\|8k;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Sets the size of the buffer used for proxying. By default, the buffer size is equal to one memory page. Depending on a platform, it is either 4K or 8K.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
