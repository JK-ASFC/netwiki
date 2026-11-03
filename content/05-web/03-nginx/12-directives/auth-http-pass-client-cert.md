---
title: "auth_http_pass_client_cert"
description: "Directive nginx auth_http_pass_client_cert (ngx_mail_auth_http_module) — Appends the Auth-SSL-Cert header with the client certificate in the PEM format (urlencoded) to requests sent to the authentication server."
tags: [nginx, directive, ngx_mail_auth_http_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_http_pass_client_cert on \| off;` |
| **Valeur par défaut** | `auth_http_pass_client_cert off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/04-mail/ngx_mail_auth_http_module\|ngx_mail_auth_http_module]] |

## Utilisation

Appends the `Auth-SSL-Cert` header with the [[12-directives/ssl-verify-client-mail-ssl|client]] certificate in the PEM format (urlencoded) to requests sent to the authentication server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
