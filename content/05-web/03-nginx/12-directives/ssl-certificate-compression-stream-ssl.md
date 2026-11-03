---
title: "ssl_certificate_compression (ngx_stream_ssl_module)"
description: "Directive nginx ssl_certificate_compression (ngx_stream_ssl_module) — Active la compression TLS 1.3 des certificats du serveur. NOTE Cette directive est prise en charge avec OpenSSL 3.2 ou plus récent ; la liste des algorithmes de compression disponibles est fournie…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate_compression on \| off;` |
| **Valeur par défaut** | `ssl_certificate_compression off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.29.1 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Active la [compression](https://datatracker.ietf.org/doc/html/rfc8879) TLS 1.3 des certificats du serveur.

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 3.2 ou plus récent ; la liste des algorithmes de compression disponibles est fournie par la bibliothèque.

> [!NOTE]
> Cette directive est prise en charge avec BoringSSL ; les algorithmes de compression disponibles incluent `zlib` (1.29.3).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
