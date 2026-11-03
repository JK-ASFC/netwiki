---
title: "ssl (ngx_mail_ssl_module)"
description: "Directive nginx ssl (ngx_mail_ssl_module) — Cette directive est devenue obsolète en version 1.15.0 et a été supprimée en version 1.25.1. Utiliser à la place le paramètre ssl de la directive listen."
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl on \| off;` |
| **Valeur par défaut** | `ssl off;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Cette directive est devenue obsolète en version 1.15.0 et a été supprimée en version 1.25.1. Utiliser à la place le paramètre `ssl` de la directive [[12-directives/listen-mail-core|listen]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
