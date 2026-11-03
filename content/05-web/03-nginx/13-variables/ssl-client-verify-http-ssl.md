---
title: "$ssl_client_verify (ngx_http_ssl_module)"
description: "Variable nginx $ssl_client_verify (ngx_http_ssl_module) — returns the result of client certificate verification: “SUCCESS”, “FAILED:reason”, and “NONE” if a certificate was not present; NOTE Prior to version 1.11.7, the “FAILED” result did not contain the…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_client_verify` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

returns the result of client certificate verification: “`SUCCESS`”, “`FAILED:`*reason*”, and “`NONE`” if a certificate was not present;

> [!NOTE]
> Prior to version 1.11.7, the “`FAILED`” result did not contain the *reason* string.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
