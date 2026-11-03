---
title: "smtp_auth"
description: "Directive nginx smtp_auth (ngx_mail_smtp_module) — Sets permitted methods of SASL authentication for SMTP clients. Supported methods are: - plain AUTH PLAIN - login AUTH LOGIN - cram-md5 AUTH CRAM-MD5. In order for this method to work, the password…"
tags: [nginx, directive, ngx_mail_smtp_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `smtp_auth method ...;` |
| **Valeur par défaut** | `smtp_auth plain login;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_smtp_module\|ngx_mail_smtp_module]] |

## Utilisation

Sets permitted methods of [SASL authentication](https://datatracker.ietf.org/doc/html/rfc2554) for SMTP clients. Supported methods are:

- **`plain`**

  [AUTH PLAIN](https://datatracker.ietf.org/doc/html/rfc4616)

- **`login`**

  [AUTH LOGIN](https://datatracker.ietf.org/doc/html/draft-murchison-sasl-login-00)

- **`cram-md5`**

  [AUTH CRAM-MD5](https://datatracker.ietf.org/doc/html/rfc2195). In order for this method to work, the password must be stored unencrypted.

- **`external`**

  [AUTH EXTERNAL](https://datatracker.ietf.org/doc/html/rfc4422) (1.11.6).

- **`none`**

  Authentication is not required.

Plain text authentication methods (`AUTH PLAIN` and `AUTH LOGIN`) are always enabled, though if the `plain` and `login` methods are not specified, `AUTH PLAIN` and `AUTH LOGIN` will not be automatically included in [[12-directives/smtp-capabilities|smtp_capabilities]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
