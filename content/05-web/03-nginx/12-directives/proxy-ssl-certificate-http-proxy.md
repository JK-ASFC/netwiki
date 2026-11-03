---
title: "proxy_ssl_certificate (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_certificate (ngx_http_proxy_module) — Indique le fichier (file) contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur HTTPS mandaté. Depuis la version 1.21.0, le nom de fichier (file) peut contenir des…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.8 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indique le fichier (*file*) contenant le certificat au format PEM utilisé pour s'authentifier auprès d'un serveur HTTPS mandaté.

Depuis la version 1.21.0, le nom de fichier (*file*) peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
