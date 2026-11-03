---
title: "js_fetch_ciphers (ngx_http_js_module)"
description: "Directive nginx js_fetch_ciphers (ngx_http_js_module) — Specifies the enabled ciphers for HTTPS requests with Fetch API. The ciphers are specified in the format understood by the OpenSSL library. The full list can be viewed using the “openssl ciphers”…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_ciphers ciphers;` |
| **Valeur par défaut** | `js_fetch_ciphers HIGH:!aNULL:!MD5;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Specifies the enabled ciphers for HTTPS requests with [[10-guides/04-njs/reference|Fetch API]]. The ciphers are specified in the format understood by the OpenSSL library.

The full list can be viewed using the “`openssl ciphers`” command.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
