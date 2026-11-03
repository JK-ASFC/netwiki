---
title: "proxy_ssl_trusted_certificate (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_trusted_certificate (ngx_stream_proxy_module) — Indique un fichier de certificats d'AC de confiance au format PEM utilisé pour vérifier le certificat du serveur mandaté."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Indique un *fichier* de certificats d'AC de confiance au format PEM utilisé pour [[12-directives/proxy-ssl-verify-stream-proxy|vérifier]] le certificat du serveur mandaté.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
