---
title: "lingering_timeout"
description: "Directive nginx lingering_timeout (ngx_http_core_module) — Lorsque lingering_close s'applique, cette directive indique le délai d'attente maximal de nouvelles données du client. Si aucune donnée n'arrive pendant ce délai, la connexion est fermée. Sinon, les…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `lingering_timeout time;` |
| **Valeur par défaut** | `lingering_timeout 5s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Lorsque [[12-directives/lingering-close|lingering_close]] s'applique, cette directive indique le délai d'attente maximal de nouvelles données du client. Si aucune donnée n'arrive pendant ce délai, la connexion est fermée. Sinon, les données sont lues et ignorées, et nginx se remet à attendre. Ce cycle « attendre-lire-ignorer » se répète, mais pas au-delà de la durée fixée par la directive [[12-directives/lingering-time|lingering_time]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
