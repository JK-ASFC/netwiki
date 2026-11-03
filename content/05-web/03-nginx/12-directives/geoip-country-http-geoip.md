---
title: "geoip_country (ngx_http_geoip_module)"
description: "Directive nginx geoip_country (ngx_http_geoip_module) — Indique la base utilisée pour déterminer le pays selon l'adresse IP du client. Les variables suivantes sont alors disponibles : - $geoip_country_code code de pays à deux lettres, par exemple « RU »,…"
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_country file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Indique la base utilisée pour déterminer le pays selon l'adresse IP du client. Les variables suivantes sont alors disponibles :

- **`$geoip_country_code`**

  code de pays à deux lettres, par exemple « `RU` », « `US` ».

- **`$geoip_country_code3`**

  code de pays à trois lettres, par exemple « `RUS` », « `USA` ».

- **`$geoip_country_name`**

  nom du pays, par exemple « `Russian Federation` », « `United States` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
