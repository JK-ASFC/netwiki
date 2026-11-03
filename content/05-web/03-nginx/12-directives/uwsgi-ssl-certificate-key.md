---
title: "uwsgi_ssl_certificate_key"
description: "Directive nginx uwsgi_ssl_certificate_key (ngx_http_uwsgi_module) — Specifies a file with the secret key in the PEM format used for authentication to a secured uwsgi server. The value engine:name:id can be specified instead of the file (1.7.9), which loads a secret…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.8 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Specifies a *file* with the secret key in the PEM format used for authentication to a secured uwsgi server.

The value `engine`:*name*:*id* can be specified instead of the *file* (1.7.9), which loads a secret key with a specified *id* from the OpenSSL engine *name*.

The value `store`:*scheme*:*id* can be specified instead of the *file* (1.29.0), which is used to load a secret key with a specified *id* and OpenSSL provider registered URI *scheme*, such as [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

Since version 1.21.0, variables can be used in the *file* name.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
