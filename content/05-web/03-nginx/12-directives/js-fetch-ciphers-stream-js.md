---
title: "js_fetch_ciphers (ngx_stream_js_module)"
description: "Directive nginx js_fetch_ciphers (ngx_stream_js_module) — Indique les chiffrements activés pour les connexions HTTPS de l'API Fetch. Les chiffrements sont donnés au format compris par la bibliothèque OpenSSL. La liste complète s'affiche avec la commande «…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_ciphers ciphers;` |
| **Valeur par défaut** | `js_fetch_ciphers HIGH:!aNULL:!MD5;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.7.0 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Indique les chiffrements activés pour les connexions HTTPS de l'[[10-guides/04-njs/reference|API Fetch]]. Les chiffrements sont donnés au format compris par la bibliothèque OpenSSL.

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
