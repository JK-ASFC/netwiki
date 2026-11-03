---
title: "max_errors"
description: "Directive nginx max_errors (ngx_mail_core_module) — Sets the number of protocol errors after which the connection is closed."
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `max_errors number;` |
| **Valeur par défaut** | `max_errors 5;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.21.0 |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Sets the number of protocol errors after which the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
