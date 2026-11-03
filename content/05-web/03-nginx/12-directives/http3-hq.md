---
title: "http3_hq"
description: "Directive nginx http3_hq (ngx_http_v3_module) — Active la négociation du protocole HTTP/0.9 utilisé dans les tests d'interopérabilité QUIC."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http3_hq on \| off;` |
| **Valeur par défaut** | `http3_hq off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Active la négociation du protocole HTTP/0.9 utilisé dans les [tests d'interopérabilité QUIC](https://github.com/marten-seemann/quic-interop-runner).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
