---
title: "resolver_timeout (ngx_mail_core_module)"
description: "Directive nginx resolver_timeout (ngx_mail_core_module) — Définit le délai des opérations DNS, par exemple : nginx resolver_timeout 5s;"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver_timeout time;` |
| **Valeur par défaut** | `resolver_timeout 30s;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Définit le délai des opérations DNS, par exemple :

```nginx
resolver_timeout 5s;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
