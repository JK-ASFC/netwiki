---
title: "smtp_greeting_delay"
description: "Directive nginx smtp_greeting_delay (ngx_mail_smtp_module) — Allows setting a delay before sending an SMTP greeting in order to reject clients who fail to wait for the greeting before sending SMTP commands."
tags: [nginx, directive, ngx_mail_smtp_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `smtp_greeting_delay time;` |
| **Valeur par défaut** | `smtp_greeting_delay 0;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_smtp_module\|ngx_mail_smtp_module]] |

## Utilisation

Allows setting a delay before sending an SMTP greeting in order to reject clients who fail to wait for the greeting before sending SMTP commands.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
