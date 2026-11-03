---
title: "proxy_ssl_crl (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_crl (ngx_http_proxy_module) — Indique le fichier (file) contenant les certificats révoqués (CRL) au format PEM utilisé pour vérifier le certificat du serveur HTTPS mandaté. Avec des certificats intermédiaires, leurs CRL doivent…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats révoqués (CRL) au format PEM utilisé pour [[12-directives/proxy-ssl-verify-http-proxy|vérifier]] le certificat du serveur HTTPS mandaté. Avec des certificats intermédiaires, leurs CRL doivent figurer dans le même fichier.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
