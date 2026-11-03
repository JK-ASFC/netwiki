---
title: "ssl_certificate_key (ngx_http_ssl_module)"
description: "Directive nginx ssl_certificate_key (ngx_http_ssl_module) — Specifies a file with the secret key in the PEM format for the given virtual server. On peut indiquer engine:name:id à la place de file (1.7.9) pour charger la clé secrète d'identifiant id depuis le…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Specifies a *file* with the secret key in the PEM format for the given virtual server.

On peut indiquer `engine`:*name*:*id* à la place de *file* (1.7.9) pour charger la clé secrète d'identifiant *id* depuis le moteur OpenSSL *name*.

On peut indiquer `store`:*scheme*:*id* à la place de *file* (1.29.0) pour charger la clé secrète d'identifiant *id* via le schéma d'URI *scheme* enregistré par un fournisseur OpenSSL, par exemple [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

The value `data`:*$variable* can be specified instead of the *file* (1.15.10), which loads a secret key from a variable without using intermediate files. Note that inappropriate use of this syntax may have its security implications, such as writing secret key data to [[12-directives/error-log|error log]].

Since version 1.15.9, variables can be used in the *file* name when using OpenSSL 1.0.2 or higher.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
