---
title: "limit_req_dry_run"
description: "Directive nginx limit_req_dry_run (ngx_http_limit_req_module) — Active le mode d'essai à blanc (dry run). Dans ce mode, le débit des requêtes n'est pas limité, mais le nombre de requêtes excédentaires est comptabilisé normalement dans la zone de mémoire partagée."
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req_dry_run on \| off;` |
| **Valeur par défaut** | `limit_req_dry_run off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.17.1 |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Active le mode d'essai à blanc (*dry run*). Dans ce mode, le débit des requêtes n'est pas limité, mais le nombre de requêtes excédentaires est comptabilisé normalement dans la zone de mémoire partagée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
