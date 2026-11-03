---
title: "directio_alignment"
description: "Directive nginx directio_alignment (ngx_http_core_module) — Définit l'alignement pour directio. Dans la plupart des cas, un alignement de 512 octets suffit. Avec XFS sous Linux, il faut toutefois le porter à 4K."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `directio_alignment size;` |
| **Valeur par défaut** | `directio_alignment 512;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.11 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit l'alignement pour [[12-directives/directio|directio]]. Dans la plupart des cas, un alignement de 512 octets suffit. Avec XFS sous Linux, il faut toutefois le porter à 4K.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
