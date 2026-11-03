---
title: "proxy_pass_error_message"
description: "Directive nginx proxy_pass_error_message (ngx_mail_proxy_module) — Indicates whether to pass the error message obtained during the authentication on the backend to the client. Usually, if the authentication in nginx is a success, the backend cannot return an error.…"
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass_error_message on \| off;` |
| **Valeur par défaut** | `proxy_pass_error_message off;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Indicates whether to pass the error message obtained during the authentication on the backend to the client.

Usually, if the authentication in nginx is a success, the backend cannot return an error. If it nevertheless returns an error, it means some internal error has occurred. In such case the backend message can contain information that should not be shown to the client. However, responding with an error for the correct password is a normal behavior for some POP3 servers. For example, CommuniGatePro informs a user about [mailbox overflow](http://www.stalker.com/CommuniGatePro/Alerts.html#Quota) or other events by periodically outputting the [authentication error](http://www.stalker.com/CommuniGatePro/POP.html#Alerts). The directive should be enabled in this case.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
