---
title: "geoip_proxy"
description: "Directive nginx geoip_proxy (ngx_http_geoip_module) — Définit les adresses de confiance. Lorsqu'une requête provient d'une adresse de confiance, c'est l'adresse du champ d'en-tête de requête X-Forwarded-For qui est utilisée."
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_proxy address \| CIDR;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.3.0, 1.2.1 |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Définit les adresses de confiance. Lorsqu'une requête provient d'une adresse de confiance, c'est l'adresse du champ d'en-tête de requête `X-Forwarded-For` qui est utilisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
