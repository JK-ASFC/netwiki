---
title: "zone_sync_ssl_ciphers"
description: "Directive nginx zone_sync_ssl_ciphers (ngx_stream_zone_sync_module) — Indique les chiffrements activés pour les connexions vers un autre serveur du cluster. Les chiffrements sont donnés au format compris par la bibliothèque OpenSSL. La liste complète s'affiche avec la…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `zone_sync_ssl_ciphers DEFAULT;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Indique les chiffrements activés pour les connexions vers un autre serveur du cluster. Les chiffrements sont donnés au format compris par la bibliothèque OpenSSL.

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
