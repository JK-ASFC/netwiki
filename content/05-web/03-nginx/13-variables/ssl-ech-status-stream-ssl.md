---
title: "$ssl_ech_status (ngx_stream_ssl_module)"
description: "Variable nginx $ssl_ech_status (ngx_stream_ssl_module) — returns the result of TLS 1.3 ECH processing: “FAILED”, “BACKEND”, “GREASE”, “SUCCESS”, or “NOT_TRIED” (1.29.4); NOTE La variable n'est prise en charge qu'avec OpenSSL 4.0 ou plus récent. Avec les…"
tags: [nginx, variable, ngx_stream_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_ech_status` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

returns the result of TLS 1.3 [[12-directives/ssl-ech-file-stream-ssl|ECH]] processing: “`FAILED`”, “`BACKEND`”, “`GREASE`”, “`SUCCESS`”, or “`NOT_TRIED`” (1.29.4);

> [!NOTE]
> La variable n'est prise en charge qu'avec OpenSSL 4.0 ou plus récent. Avec les versions plus anciennes, sa valeur est une chaîne vide.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
