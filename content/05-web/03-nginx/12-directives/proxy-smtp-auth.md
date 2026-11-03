---
title: "proxy_smtp_auth"
description: "Directive nginx proxy_smtp_auth (ngx_mail_proxy_module) — Enables or disables user authentication on the SMTP backend using the AUTH command. If XCLIENT is also enabled, then the XCLIENT command will not send the LOGIN parameter."
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_smtp_auth on \| off;` |
| **Valeur par défaut** | `proxy_smtp_auth off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Enables or disables user authentication on the SMTP backend using the `AUTH` command.

If [[12-directives/xclient|XCLIENT]] is also enabled, then the `XCLIENT` command will not send the `LOGIN` parameter.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
