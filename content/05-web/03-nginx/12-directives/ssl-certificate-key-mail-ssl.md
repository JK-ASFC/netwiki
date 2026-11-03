---
title: "ssl_certificate_key (ngx_mail_ssl_module)"
description: "Directive nginx ssl_certificate_key (ngx_mail_ssl_module) — Specifies a file with the secret key in the PEM format for the given server. On peut indiquer engine:name:id à la place de file (1.7.9) pour charger la clé secrète d'identifiant id depuis le moteur…"
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

On peut indiquer `engine`:*name*:*id* à la place de *file* (1.7.9) pour charger la clé secrète d'identifiant *id* depuis le moteur OpenSSL *name*.

On peut indiquer `store`:*scheme*:*id* à la place de *file* (1.29.0) pour charger la clé secrète d'identifiant *id* via le schéma d'URI *scheme* enregistré par un fournisseur OpenSSL, par exemple [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

The value `data`:*key* can be specified instead of the *file* (1.15.10), which loads a secret key without using intermediate files. Note that inappropriate use of this syntax may have its security implications, such as writing secret key data to [[12-directives/error-log|error log]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
