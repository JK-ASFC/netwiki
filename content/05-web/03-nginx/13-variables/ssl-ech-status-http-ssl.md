---
title: "$ssl_ech_status (ngx_http_ssl_module)"
description: "Variable nginx $ssl_ech_status (ngx_http_ssl_module) — renvoie le résultat du traitement ECH TLS 1.3 : « FAILED », « BACKEND », « GREASE », « SUCCESS » ou « NOT_TRIED » (1.29.4) ; NOTE La variable n'est prise en charge qu'avec OpenSSL 4.0 ou plus récent.…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_ech_status` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie le résultat du traitement [[12-directives/ssl-ech-file-http-ssl|ECH]] TLS 1.3 : « `FAILED` », « `BACKEND` », « `GREASE` », « `SUCCESS` » ou « `NOT_TRIED` » (1.29.4) ;

> [!NOTE]
> La variable n'est prise en charge qu'avec OpenSSL 4.0 ou plus récent. Avec les versions plus anciennes, sa valeur est une chaîne vide.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
