---
title: "pop3_capabilities"
description: "Directive nginx pop3_capabilities (ngx_mail_pop3_module) — Sets the POP3 protocol extensions list that is passed to the client in response to the CAPA command. The authentication methods specified in the pop3_auth directive (SASL extension) and STLS are…"
tags: [nginx, directive, ngx_mail_pop3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pop3_capabilities extension ...;` |
| **Valeur par défaut** | `pop3_capabilities TOP USER UIDL;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_pop3_module\|ngx_mail_pop3_module]] |

## Utilisation

Sets the [POP3 protocol](https://datatracker.ietf.org/doc/html/rfc2449) extensions list that is passed to the client in response to the `CAPA` command. The authentication methods specified in the [[12-directives/pop3-auth|pop3_auth]] directive ([SASL](https://datatracker.ietf.org/doc/html/rfc2449) extension) and [STLS](https://datatracker.ietf.org/doc/html/rfc2595) are automatically added to this list depending on the [[12-directives/starttls|starttls]] directive value.

It makes sense to specify the extensions supported by the POP3 backends to which the clients are proxied (if these extensions are related to commands used after the authentication, when nginx transparently proxies the client connection to the backend).

The current list of standardized extensions is published at [www.iana.org](http://www.iana.org/assignments/pop3-extension-mechanism).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
