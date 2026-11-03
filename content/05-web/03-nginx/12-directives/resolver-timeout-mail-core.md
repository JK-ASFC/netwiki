---
title: "resolver_timeout (ngx_mail_core_module)"
description: "Directive nginx resolver_timeout (ngx_mail_core_module) — Sets a timeout for DNS operations, for example: nginx resolver_timeout 5s;"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver_timeout time;` |
| **Valeur par défaut** | `resolver_timeout 30s;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Sets a timeout for DNS operations, for example:

```nginx
resolver_timeout 5s;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
