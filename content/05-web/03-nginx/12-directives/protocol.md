---
title: "protocol"
description: "Directive nginx protocol (ngx_mail_core_module) — Sets the protocol for a proxied server. Supported protocols are IMAP, POP3, and SMTP. If the directive is not set, the protocol can be detected automatically based on the well-known port specified in…"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `protocol imap \| pop3 \| smtp;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Sets the protocol for a proxied server. Supported protocols are [[11-modules/04-mail/ngx_mail_imap_module|IMAP]], [[11-modules/04-mail/ngx_mail_pop3_module|POP3]], and [[11-modules/04-mail/ngx_mail_smtp_module|SMTP]].

If the directive is not set, the protocol can be detected automatically based on the well-known port specified in the [[12-directives/listen-mail-core|listen]] directive:

- `imap`: 143, 993
- `pop3`: 110, 995
- `smtp`: 25, 587, 465

Unnecessary protocols can be disabled using the [[10-guides/01-introduction/configure|configuration]] parameters `--without-mail_imap_module`, `--without-mail_pop3_module`, and `--without-mail_smtp_module`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
