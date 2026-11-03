---
title: "geoip_proxy_recursive"
description: "Directive nginx geoip_proxy_recursive (ngx_http_geoip_module) — Si la recherche récursive est désactivée, l'adresse d'origine du client qui correspond à une adresse de confiance est remplacée par la dernière adresse transmise dans X-Forwarded-For. Si elle est…"
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_proxy_recursive on \| off;` |
| **Valeur par défaut** | `geoip_proxy_recursive off;` |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.3.0, 1.2.1 |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Si la recherche récursive est désactivée, l'adresse d'origine du client qui correspond à une adresse de confiance est remplacée par la dernière adresse transmise dans `X-Forwarded-For`. Si elle est activée, elle est remplacée par la dernière adresse non fiable transmise dans `X-Forwarded-For`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
