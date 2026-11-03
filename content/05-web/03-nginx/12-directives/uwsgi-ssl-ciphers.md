---
title: "uwsgi_ssl_ciphers"
description: "Directive nginx uwsgi_ssl_ciphers (ngx_http_uwsgi_module) — Indique les suites de chiffrement activées pour les requêtes vers un serveur uwsgi sécurisé. Elles s'écrivent au format reconnu par la bibliothèque OpenSSL. La liste complète s'affiche avec la…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `uwsgi_ssl_ciphers DEFAULT;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.8 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indique les suites de chiffrement activées pour les requêtes vers un serveur uwsgi sécurisé. Elles s'écrivent au format reconnu par la bibliothèque OpenSSL.

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
