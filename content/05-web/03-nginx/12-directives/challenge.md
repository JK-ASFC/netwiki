---
title: "challenge"
description: "Directive nginx challenge (ngx_http_acme_module) — Indique le type de défi ACME à utiliser pour l'émetteur. Valeurs acceptées : - http-01 (http) - tls-alpn-01 (tls-alpn) NOTE Les défis ACME sont versionnés. Si un nom sans version est indiqué, le…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `challenge type;` |
| **Valeur par défaut** | `challenge http-01;` |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.2.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Indique le type de défi ACME à utiliser pour l'émetteur.

Valeurs acceptées :

- `http-01` (`http`)
- `tls-alpn-01` (`tls-alpn`)

> [!NOTE]
> Les défis ACME sont versionnés. Si un nom sans version est indiqué, le module choisit automatiquement la dernière version mise en œuvre.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
