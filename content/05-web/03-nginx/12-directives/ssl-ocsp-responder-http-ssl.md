---
title: "ssl_ocsp_responder (ngx_http_ssl_module)"
description: "Directive nginx ssl_ocsp_responder (ngx_http_ssl_module) — Overrides the URL of the OCSP responder specified in the “Authority Information Access” certificate extension for validation of client certificates. Only “http://” OCSP responders are supported:…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ocsp_responder url;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.19.0 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Overrides the URL of the OCSP responder specified in the “[Authority Information Access](https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.2.1)” certificate extension for [[12-directives/ssl-ocsp-http-ssl|validation]] of client certificates.

Only “`http://`” OCSP responders are supported:

```nginx
ssl_ocsp_responder http://ocsp.example.com/;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
