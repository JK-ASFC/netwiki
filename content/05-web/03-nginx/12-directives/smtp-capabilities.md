---
title: "smtp_capabilities"
description: "Directive nginx smtp_capabilities (ngx_mail_smtp_module) — Sets the SMTP protocol extensions list that is passed to the client in response to the EHLO command. The authentication methods specified in the smtp_auth directive and STARTTLS are automatically…"
tags: [nginx, directive, ngx_mail_smtp_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `smtp_capabilities extension ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_smtp_module\|ngx_mail_smtp_module]] |

## Utilisation

Sets the SMTP protocol extensions list that is passed to the client in response to the `EHLO` command. The authentication methods specified in the [[12-directives/smtp-auth|smtp_auth]] directive and [STARTTLS](https://datatracker.ietf.org/doc/html/rfc3207) are automatically added to this list depending on the [[12-directives/starttls|starttls]] directive value.

It makes sense to specify the extensions supported by the MTA to which the clients are proxied (if these extensions are related to commands used after the authentication, when nginx transparently proxies the client connection to the backend).

The current list of standardized extensions is published at [www.iana.org](http://www.iana.org/assignments/mail-parameters).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
