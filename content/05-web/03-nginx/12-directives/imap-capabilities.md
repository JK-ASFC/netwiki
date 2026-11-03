---
title: "imap_capabilities"
description: "Directive nginx imap_capabilities (ngx_mail_imap_module) — Sets the IMAP protocol extensions list that is passed to the client in response to the CAPABILITY command. The authentication methods specified in the imap_auth directive and STARTTLS are…"
tags: [nginx, directive, ngx_mail_imap_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `imap_capabilities extension ...;` |
| **Valeur par défaut** | `imap_capabilities IMAP4 IMAP4rev1 UIDPLUS;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_imap_module\|ngx_mail_imap_module]] |

## Utilisation

Sets the [IMAP protocol](https://datatracker.ietf.org/doc/html/rfc3501) extensions list that is passed to the client in response to the `CAPABILITY` command. The authentication methods specified in the [[12-directives/imap-auth|imap_auth]] directive and [STARTTLS](https://datatracker.ietf.org/doc/html/rfc2595) are automatically added to this list depending on the [[12-directives/starttls|starttls]] directive value.

It makes sense to specify the extensions supported by the IMAP backends to which the clients are proxied (if these extensions are related to commands used after the authentication, when nginx transparently proxies a client connection to the backend).

The current list of standardized extensions is published at [www.iana.org](http://www.iana.org/assignments/imap4-capabilities).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
