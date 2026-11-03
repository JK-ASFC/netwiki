---
title: "xclient"
description: "Directive nginx xclient (ngx_mail_proxy_module) — Enables or disables the passing of the XCLIENT command with client parameters when connecting to the SMTP backend. With XCLIENT, the MTA is able to write client information to the log and apply…"
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xclient on \| off;` |
| **Valeur par défaut** | `xclient on;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Enables or disables the passing of the [XCLIENT](http://www.postfix.org/XCLIENT_README.html) command with client parameters when connecting to the SMTP backend.

With `XCLIENT`, the MTA is able to write client information to the log and apply various limitations based on this data.

If `XCLIENT` is enabled then nginx passes the following commands when connecting to the backend:

- `EHLO` with the [[12-directives/server-name-mail-core|server name]]
- `XCLIENT`
- `EHLO` or `HELO`, as passed by the client

If the name [[12-directives/resolver-mail-core|found]] by the client IP address points to the same address, it is passed in the `NAME` parameter of the `XCLIENT` command. If the name could not be found, points to a different address, or [[12-directives/resolver-mail-core|resolver]] is not specified, the `[UNAVAILABLE]` is passed in the `NAME` parameter. If an error has occurred in the process of resolving, the `[TEMPUNAVAIL]` value is used.

If `XCLIENT` is disabled then nginx passes the `EHLO` command with the [[12-directives/server-name-mail-core|server name]] when connecting to the backend if the client has passed `EHLO`, or `HELO` with the server name, otherwise.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
