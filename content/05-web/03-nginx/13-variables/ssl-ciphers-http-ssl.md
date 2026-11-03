---
title: "$ssl_ciphers (ngx_http_ssl_module)"
description: "Variable nginx $ssl_ciphers (ngx_http_ssl_module) — returns the list of ciphers supported by the client (1.11.7). Known ciphers are listed by names, unknown are shown in hexadecimal, for example: nginx AES128-SHA:AES256-SHA:0x00ff NOTE The variable is…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_ciphers` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

returns the list of ciphers supported by the client (1.11.7). Known ciphers are listed by names, unknown are shown in hexadecimal, for example:

```nginx
AES128-SHA:AES256-SHA:0x00ff
```

> [!NOTE]
> The variable is fully supported only when using OpenSSL version 1.0.2 or higher. With older versions, the variable is available only for new sessions and lists only known ciphers.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
