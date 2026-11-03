---
title: "imap_client_buffer"
description: "Directive nginx imap_client_buffer (ngx_mail_imap_module) — Définit la taille (size) du tampon utilisé pour lire les commandes IMAP. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme."
tags: [nginx, directive, ngx_mail_imap_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `imap_client_buffer size;` |
| **Valeur par défaut** | `imap_client_buffer 4k\|8k;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_imap_module\|ngx_mail_imap_module]] |

## Utilisation

Définit la taille (*size*) du tampon utilisé pour lire les commandes IMAP. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
