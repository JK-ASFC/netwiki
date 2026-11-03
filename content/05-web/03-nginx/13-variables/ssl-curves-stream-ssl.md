---
title: "$ssl_curves (ngx_stream_ssl_module)"
description: "Variable nginx $ssl_curves (ngx_stream_ssl_module) — returns the list of curves supported by the client (1.11.7). Known curves are listed by names, unknown are shown in hexadecimal, for example: nginx 0x001d:prime256v1:secp521r1:secp384r1 NOTE The…"
tags: [nginx, variable, ngx_stream_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_curves` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

returns the list of curves supported by the client (1.11.7). Known curves are listed by names, unknown are shown in hexadecimal, for example:

```nginx
0x001d:prime256v1:secp521r1:secp384r1
```

> [!NOTE]
> The variable is supported only when using OpenSSL version 1.0.2 or higher. With older versions, the variable value will be an empty string.

> [!NOTE]
> The variable is available only for new sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
