---
title: "ssl_client_certificate (ngx_stream_ssl_module)"
description: "Directive nginx ssl_client_certificate (ngx_stream_ssl_module) — Indique le fichier (file) contenant les certificats d'autorités de confiance au format PEM utilisé pour vérifier les certificats des clients et les réponses OCSP si ssl_stapling est activé. La liste…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_client_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats d'autorités de confiance au format PEM utilisé pour [[12-directives/ssl-verify-client-stream-ssl|vérifier]] les certificats des clients et les réponses OCSP si [[12-directives/ssl-stapling-stream-ssl|ssl_stapling]] est activé.

La liste des certificats est envoyée aux clients. Si ce n'est pas souhaité, on peut utiliser la directive [[12-directives/ssl-trusted-certificate-stream-ssl|ssl_trusted_certificate]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
