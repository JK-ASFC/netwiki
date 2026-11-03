---
title: "geoip_org (ngx_http_geoip_module)"
description: "Directive nginx geoip_org (ngx_http_geoip_module) — Indique la base utilisée pour déterminer l'organisation selon l'adresse IP du client. La variable suivante est alors disponible : - $geoip_org nom de l'organisation, par exemple « The University of…"
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_org file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.0.3 |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Indique la base utilisée pour déterminer l'organisation selon l'adresse IP du client. La variable suivante est alors disponible :

- **`$geoip_org`**

  nom de l'organisation, par exemple « The University of Melbourne ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
