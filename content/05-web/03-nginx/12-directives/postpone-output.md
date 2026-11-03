---
title: "postpone_output"
description: "Directive nginx postpone_output (ngx_http_core_module) — Si possible, la transmission des données au client est différée jusqu'à ce que nginx ait au moins size octets à envoyer. La valeur zéro désactive ce report."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `postpone_output size;` |
| **Valeur par défaut** | `postpone_output 1460;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Si possible, la transmission des données au client est différée jusqu'à ce que nginx ait au moins *size* octets à envoyer. La valeur zéro désactive ce report.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
