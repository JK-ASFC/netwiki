---
title: "proxy_ssl_ciphers (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_ciphers (ngx_http_proxy_module) — Indique les suites de chiffrement activées pour les requêtes vers un serveur HTTPS mandaté. Elles s'écrivent au format reconnu par la bibliothèque OpenSSL. La liste complète s'affiche avec la…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `proxy_ssl_ciphers DEFAULT;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.6 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indique les suites de chiffrement activées pour les requêtes vers un serveur HTTPS mandaté. Elles s'écrivent au format reconnu par la bibliothèque OpenSSL.

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
