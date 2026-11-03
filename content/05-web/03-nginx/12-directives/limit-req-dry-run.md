---
title: "limit_req_dry_run"
description: "Directive nginx limit_req_dry_run (ngx_http_limit_req_module) — Enables the dry run mode. In this mode, requests processing rate is not limited, however, in the shared memory zone, the number of excessive requests is accounted as usual."
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req_dry_run on \| off;` |
| **Valeur par défaut** | `limit_req_dry_run off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.17.1 |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Enables the dry run mode. In this mode, requests processing rate is not limited, however, in the shared memory zone, the number of excessive requests is accounted as usual.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
