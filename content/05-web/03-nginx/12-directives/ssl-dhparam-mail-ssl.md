---
title: "ssl_dhparam (ngx_mail_ssl_module)"
description: "Directive nginx ssl_dhparam (ngx_mail_ssl_module) — Specifies a file with DH parameters for DHE ciphers. By default no parameters are set, and therefore DHE ciphers will not be used. NOTE Prior to version 1.11.0, builtin parameters were used by…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_dhparam file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 0.7.2 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Specifies a *file* with DH parameters for DHE ciphers.

By default no parameters are set, and therefore DHE ciphers will not be used.

> [!NOTE]
> Prior to version 1.11.0, builtin parameters were used by default.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
