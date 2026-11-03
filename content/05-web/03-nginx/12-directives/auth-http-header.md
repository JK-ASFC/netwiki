---
title: "auth_http_header"
description: "Directive nginx auth_http_header (ngx_mail_auth_http_module) — Appends the specified header to requests sent to the authentication server. This header can be used as the shared secret to verify that the request comes from nginx. For example: nginx…"
tags: [nginx, directive, ngx_mail_auth_http_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_http_header header value;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_auth_http_module\|ngx_mail_auth_http_module]] |

## Utilisation

Appends the specified header to requests sent to the authentication server. This header can be used as the shared secret to verify that the request comes from nginx. For example:

```nginx
auth_http_header X-Auth-Key "secret_string";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
