---
title: "proxy_protocol (ngx_stream_proxy_module)"
description: "Directive nginx proxy_protocol (ngx_stream_proxy_module) — Active le protocole PROXY pour les connexions vers un serveur mandaté. Le paramètre on active la version 1 du protocole PROXY (format texte). Le paramètre v2 (1.31.4) active la version 2 (format…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_protocol on \| off \| v2;` |
| **Valeur par défaut** | `proxy_protocol off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Active le [protocole PROXY](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) pour les connexions vers un serveur mandaté. Le paramètre `on` active la version 1 du protocole PROXY (format texte). Le paramètre `v2` (1.31.4) active la version 2 (format binaire).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
