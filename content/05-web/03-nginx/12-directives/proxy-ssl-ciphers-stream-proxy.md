---
title: "proxy_ssl_ciphers (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_ciphers (ngx_stream_proxy_module) — Indique les chiffrements activés pour les connexions vers un serveur mandaté. Les chiffrements sont donnés au format compris par la bibliothèque OpenSSL. La liste complète s'affiche avec la commande…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `proxy_ssl_ciphers DEFAULT;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Indique les chiffrements activés pour les connexions vers un serveur mandaté. Les chiffrements sont donnés au format compris par la bibliothèque OpenSSL.

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
