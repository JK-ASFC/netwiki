---
title: "ssl_ech_file (ngx_http_ssl_module)"
description: "Directive nginx ssl_ech_file (ngx_http_ssl_module) — Indique le fichier (file) contenant la configuration de ClientHello chiffré (ECHConfig) au format PEM, utilisée pour activer ECH TLS 1.3 en mode partagé. NOTE Cette directive est prise en charge avec…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ech_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.29.4 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant la configuration de ClientHello chiffré (`ECHConfig`) au format [PEM](https://datatracker.ietf.org/doc/html/rfc9934), utilisée pour activer [ECH](https://datatracker.ietf.org/doc/html/rfc9849) TLS 1.3 en mode partagé.

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 4.0 ou plus récent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
