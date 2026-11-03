---
title: "proxy_ssl_certificate (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_certificate (ngx_stream_proxy_module) — Indique un fichier contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur mandaté. Depuis la version 1.21.0, le nom de fichier (file) peut contenir des variables."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Indique un *fichier* contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur mandaté.

Depuis la version 1.21.0, le nom de fichier (*file*) peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
