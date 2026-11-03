---
title: "zone_sync_ssl_certificate"
description: "Directive nginx zone_sync_ssl_certificate (ngx_stream_zone_sync_module) — Indique un fichier contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un autre serveur du cluster."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Indique un *fichier* contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un autre serveur du cluster.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
