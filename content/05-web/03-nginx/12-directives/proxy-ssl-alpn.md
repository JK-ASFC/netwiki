---
title: "proxy_ssl_alpn"
description: "Directive nginx proxy_ssl_alpn (ngx_stream_proxy_module) — Indique la liste des protocoles annoncés via l'extension ALPN lors de l'établissement d'une connexion avec le serveur mandaté. Par exemple : nginx proxy_ssl_alpn h2 http/1.1; La valeur peut contenir…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_alpn protocol ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.31.0 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Indique la liste des protocoles annoncés via l'extension [ALPN](https://datatracker.ietf.org/doc/html/rfc7301) lors de l'établissement d'une connexion avec le serveur mandaté. Par exemple :

```nginx
proxy_ssl_alpn h2 http/1.1;
```

La valeur peut contenir des variables :

```nginx
proxy_ssl_alpn $ssl_alpn_protocol;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
