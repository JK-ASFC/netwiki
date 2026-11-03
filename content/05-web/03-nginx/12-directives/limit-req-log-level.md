---
title: "limit_req_log_level"
description: "Directive nginx limit_req_log_level (ngx_http_limit_req_module) — Définit le niveau de journalisation souhaité lorsque le serveur refuse de traiter des requêtes à cause d'un dépassement de débit, ou retarde leur traitement. Le niveau des retards est inférieur d'un…"
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req_log_level info \| notice \| warn \| error;` |
| **Valeur par défaut** | `limit_req_log_level error;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.18 |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Définit le niveau de journalisation souhaité lorsque le serveur refuse de traiter des requêtes à cause d'un dépassement de débit, ou retarde leur traitement. Le niveau des retards est inférieur d'un cran à celui des refus ; par exemple, avec « `limit_req_log_level notice` », les retards sont journalisés au niveau `info`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
