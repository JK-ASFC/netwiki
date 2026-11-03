---
title: "server_name (ngx_mail_core_module)"
description: "Directive nginx server_name (ngx_mail_core_module) — Sets the server name that is used: - in the initial POP3/SMTP server greeting; - in the salt during the SASL CRAM-MD5 authentication; - in the EHLO command when connecting to the SMTP backend, if the…"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_name name;` |
| **Valeur par défaut** | `server_name hostname;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Sets the server name that is used:

- in the initial POP3/SMTP server greeting;
- in the salt during the SASL CRAM-MD5 authentication;
- in the `EHLO` command when connecting to the SMTP backend, if the passing of the [[12-directives/xclient|XCLIENT]] command is enabled.

If the directive is not specified, the machine’s hostname is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
