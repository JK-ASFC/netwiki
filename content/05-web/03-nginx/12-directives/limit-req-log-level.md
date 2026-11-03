---
title: "limit_req_log_level"
description: "Directive nginx limit_req_log_level (ngx_http_limit_req_module) — Sets the desired logging level for cases when the server refuses to process requests due to rate exceeding, or delays request processing. Logging level for delays is one point less than for refusals;…"
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req_log_level info \| notice \| warn \| error;` |
| **Valeur par défaut** | `limit_req_log_level error;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.18 |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Sets the desired logging level for cases when the server refuses to process requests due to rate exceeding, or delays request processing. Logging level for delays is one point less than for refusals; for example, if “`limit_req_log_level notice`” is specified, delays are logged with the `info` level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
