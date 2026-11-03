---
title: "$ssl_sigalgs (ngx_http_ssl_module)"
description: "Variable nginx $ssl_sigalgs (ngx_http_ssl_module) — returns the list of signature algorithms supported by the client (1.31.2). Known values are listed by names, unknown are shown in hexadecimal, for example: nginx…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_sigalgs` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

returns the list of [signature algorithms](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-16) supported by the client (1.31.2). Known values are listed by names, unknown are shown in hexadecimal, for example:

```nginx
0xfe00:rsa_pkcs1_sha256:rsa_pss_rsae_sha256:ecdsa_secp256r1_sha256
```

> [!NOTE]
> The variable is fully supported only when using OpenSSL version 4.0 or higher. For OpenSSL versions 1.0.2+, the values are always shown in hexadecimal. With older versions, the variable value will be an empty string.

> [!NOTE]
> The variable is available only for new sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
