---
title: "pop3_auth"
description: "Directive nginx pop3_auth (ngx_mail_pop3_module) — Sets permitted methods of authentication for POP3 clients. Supported methods are: - plain USER/PASS, AUTH PLAIN, AUTH LOGIN - apop APOP. In order for this method to work, the password must be stored…"
tags: [nginx, directive, ngx_mail_pop3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pop3_auth method ...;` |
| **Valeur par défaut** | `pop3_auth plain;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_pop3_module\|ngx_mail_pop3_module]] |

## Utilisation

Sets permitted methods of authentication for POP3 clients. Supported methods are:

- **`plain`**

  [USER/PASS](https://datatracker.ietf.org/doc/html/rfc1939), [AUTH PLAIN](https://datatracker.ietf.org/doc/html/rfc4616), [AUTH LOGIN](https://datatracker.ietf.org/doc/html/draft-murchison-sasl-login-00)

- **`apop`**

  [APOP](https://datatracker.ietf.org/doc/html/rfc1939). In order for this method to work, the password must be stored unencrypted.

- **`cram-md5`**

  [AUTH CRAM-MD5](https://datatracker.ietf.org/doc/html/rfc2195). In order for this method to work, the password must be stored unencrypted.

- **`external`**

  [AUTH EXTERNAL](https://datatracker.ietf.org/doc/html/rfc4422) (1.11.6).

Plain text authentication methods (`USER/PASS`, `AUTH PLAIN`, and `AUTH LOGIN`) are always enabled, though if the `plain` method is not specified, `AUTH PLAIN` and `AUTH LOGIN` will not be automatically included in [[12-directives/pop3-capabilities|pop3_capabilities]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
