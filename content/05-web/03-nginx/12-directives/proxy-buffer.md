---
title: "proxy_buffer"
description: "Directive nginx proxy_buffer (ngx_mail_proxy_module) — Définit la taille du tampon utilisé pour le relais. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme."
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_buffer size;` |
| **Valeur par défaut** | `proxy_buffer 4k\|8k;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Définit la taille du tampon utilisé pour le relais. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
