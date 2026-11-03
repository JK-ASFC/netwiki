---
title: "$ssl_early_data"
description: "Variable nginx $ssl_early_data (ngx_http_ssl_module) — returns “1” if TLS 1.3 early data is used and the handshake is not complete, otherwise “” (1.15.3)."
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_early_data` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

returns “`1`” if TLS 1.3 [[12-directives/ssl-early-data|early data]] is used and the handshake is not complete, otherwise “” (1.15.3).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
