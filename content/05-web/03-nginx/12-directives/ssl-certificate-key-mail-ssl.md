---
title: "ssl_certificate_key (ngx_mail_ssl_module)"
description: "Directive nginx ssl_certificate_key (ngx_mail_ssl_module) — Specifies a file with the secret key in the PEM format for the given server. The value engine:name:id can be specified instead of the file (1.7.9), which loads a secret key with a specified id from…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Specifies a *file* with the secret key in the PEM format for the given server.

The value `engine`:*name*:*id* can be specified instead of the *file* (1.7.9), which loads a secret key with a specified *id* from the OpenSSL engine *name*.

The value `store`:*scheme*:*id* can be specified instead of the *file* (1.29.0), which is used to load a secret key with a specified *id* and OpenSSL provider registered URI *scheme*, such as [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

The value `data`:*key* can be specified instead of the *file* (1.15.10), which loads a secret key without using intermediate files. Note that inappropriate use of this syntax may have its security implications, such as writing secret key data to [[12-directives/error-log|error log]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
