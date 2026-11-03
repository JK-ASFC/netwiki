---
title: "$ssl_sigalg (ngx_http_ssl_module)"
description: "Variable nginx $ssl_sigalg (ngx_http_ssl_module) — returns the signature algorithm for the server certificate for an established SSL connection (1.29.3). NOTE The variable is supported only when using OpenSSL version 3.5 or higher. With older…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_sigalg` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

returns the [signature algorithm](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-16) for the server certificate for an established SSL connection (1.29.3).

> [!NOTE]
> The variable is supported only when using OpenSSL version 3.5 or higher. With older versions, the variable value will be an empty string.

> [!NOTE]
> The variable is available only for new sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
