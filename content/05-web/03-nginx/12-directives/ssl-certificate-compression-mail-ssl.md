---
title: "ssl_certificate_compression (ngx_mail_ssl_module)"
description: "Directive nginx ssl_certificate_compression (ngx_mail_ssl_module) — Enables TLS 1.3 compression of server certificates. NOTE The directive is supported when using OpenSSL 3.2 or higher; the list of supported compression algorithms is provided by the library. NOTE The…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate_compression on \| off;` |
| **Valeur par défaut** | `ssl_certificate_compression off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.29.1 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Enables TLS 1.3 [compression](https://datatracker.ietf.org/doc/html/rfc8879) of server certificates.

> [!NOTE]
> The directive is supported when using OpenSSL 3.2 or higher; the list of supported compression algorithms is provided by the library.

> [!NOTE]
> The directive is supported when using BoringSSL; the list of supported compression algorithms includes `zlib` (1.29.3).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
