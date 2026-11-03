---
title: "js_fetch_trusted_certificate (ngx_http_js_module)"
description: "Directive nginx js_fetch_trusted_certificate (ngx_http_js_module) — Indique le fichier (file) contenant les certificats d'autorités de confiance au format PEM utilisé pour vérifier le certificat HTTPS avec l'API Fetch."
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats d'autorités de confiance au format PEM utilisé pour [[10-guides/04-njs/reference|vérifier]] le certificat HTTPS avec l'[[10-guides/04-njs/reference|API Fetch]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
