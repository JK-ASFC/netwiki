---
title: "lingering_time"
description: "Directive nginx lingering_time (ngx_http_core_module) — Lorsque lingering_close s'applique, cette directive indique la durée maximale pendant laquelle nginx traite (lit et ignore) les données supplémentaires envoyées par le client. Ensuite, la connexion…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `lingering_time time;` |
| **Valeur par défaut** | `lingering_time 30s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Lorsque [[12-directives/lingering-close|lingering_close]] s'applique, cette directive indique la durée maximale pendant laquelle nginx traite (lit et ignore) les données supplémentaires envoyées par le client. Ensuite, la connexion est fermée, même s'il reste des données.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
