---
title: "imap_client_buffer"
description: "Directive nginx imap_client_buffer (ngx_mail_imap_module) — Sets the size of the buffer used for reading IMAP commands. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform."
tags: [nginx, directive, ngx_mail_imap_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `imap_client_buffer size;` |
| **Valeur par défaut** | `imap_client_buffer 4k\|8k;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_imap_module\|ngx_mail_imap_module]] |

## Utilisation

Sets the *size* of the buffer used for reading IMAP commands. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
