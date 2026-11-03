---
title: "ssl_stapling_responder (ngx_stream_ssl_module)"
description: "Directive nginx ssl_stapling_responder (ngx_stream_ssl_module) — Remplace l'URL du répondeur OCSP indiquée dans l'extension de certificat « Authority Information Access ». Seuls les répondeurs OCSP « http:// » sont pris en charge : nginx ssl_stapling_responder…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_stapling_responder url;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Remplace l'URL du répondeur OCSP indiquée dans l'extension de certificat « [Authority Information Access](https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.2.1) ».

Seuls les répondeurs OCSP « `http://` » sont pris en charge :

```nginx
ssl_stapling_responder http://ocsp.example.com/;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
