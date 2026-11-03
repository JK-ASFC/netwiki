---
title: "starttls"
description: "Directive nginx starttls (ngx_mail_ssl_module) — - on allow usage of the STLS command for the POP3 and the STARTTLS command for the IMAP and SMTP; - off deny usage of the STLS and STARTTLS commands; - only require preliminary TLS transition."
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `starttls on \| off \| only;` |
| **Valeur par défaut** | `starttls off;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

- **`on`**

  allow usage of the `STLS` command for the POP3 and the `STARTTLS` command for the IMAP and SMTP;

- **`off`**

  deny usage of the `STLS` and `STARTTLS` commands;

- **`only`**

  require preliminary TLS transition.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
