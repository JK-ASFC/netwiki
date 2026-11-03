---
title: "ssl_ciphers (ngx_http_ssl_module)"
description: "Directive nginx ssl_ciphers (ngx_http_ssl_module) — Specifies the enabled ciphers. The ciphers are specified in the format understood by the OpenSSL library, for example: nginx ssl_ciphers ALL:aNULL:EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP; The…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ciphers ciphers;` |
| **Valeur par défaut** | `ssl_ciphers HIGH:!aNULL:!MD5;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Specifies the enabled ciphers. The ciphers are specified in the format understood by the OpenSSL library, for example:

```nginx
ssl_ciphers ALL:!aNULL:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
```

The full list can be viewed using the “`openssl ciphers`” command.

> [!NOTE]
> The previous versions of nginx used [[10-guides/02-http/configuring-https-servers|different]] ciphers by default.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
