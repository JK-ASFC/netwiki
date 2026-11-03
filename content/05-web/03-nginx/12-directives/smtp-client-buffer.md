---
title: "smtp_client_buffer"
description: "Directive nginx smtp_client_buffer (ngx_mail_smtp_module) — Définit la taille (size) du tampon utilisé pour lire les commandes SMTP. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme."
tags: [nginx, directive, ngx_mail_smtp_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `smtp_client_buffer size;` |
| **Valeur par défaut** | `smtp_client_buffer 4k\|8k;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_smtp_module\|ngx_mail_smtp_module]] |

## Utilisation

Définit la taille (*size*) du tampon utilisé pour lire les commandes SMTP. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
