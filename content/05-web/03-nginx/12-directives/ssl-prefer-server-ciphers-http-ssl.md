---
title: "ssl_prefer_server_ciphers (ngx_http_ssl_module)"
description: "Directive nginx ssl_prefer_server_ciphers (ngx_http_ssl_module) — Indique que les suites de chiffrement du serveur doivent être préférées à celles du client avec les protocoles SSLv3 et TLS."
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_prefer_server_ciphers on \| off;` |
| **Valeur par défaut** | `ssl_prefer_server_ciphers off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Indique que les suites de chiffrement du serveur doivent être préférées à celles du client avec les protocoles SSLv3 et TLS.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
