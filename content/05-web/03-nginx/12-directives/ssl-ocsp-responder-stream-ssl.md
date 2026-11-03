---
title: "ssl_ocsp_responder (ngx_stream_ssl_module)"
description: "Directive nginx ssl_ocsp_responder (ngx_stream_ssl_module) — Overrides the URL of the OCSP responder specified in the “Authority Information Access” certificate extension for validation of client certificates. Seuls les répondeurs OCSP « http:// » sont pris en…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ocsp_responder url;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Overrides the URL of the OCSP responder specified in the “[Authority Information Access](https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.2.1)” certificate extension for [[12-directives/ssl-ocsp-stream-ssl|validation]] of client certificates.

Seuls les répondeurs OCSP « `http://` » sont pris en charge :

```nginx
ssl_ocsp_responder http://ocsp.example.com/;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
