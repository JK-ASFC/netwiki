---
title: "session_log_format"
description: "Directive nginx session_log_format (ngx_http_session_log_module) — Specifies the output format of a log. The value of the $body_bytes_sent variable is aggregated across all requests in a session. The values of all other variables available for logging correspond to…"
tags: [nginx, directive, ngx_http_session_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_log_format name string ...;` |
| **Valeur par défaut** | `session_log_format combined "...";` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_session_log_module\|ngx_http_session_log_module]] |

## Utilisation

Specifies the output format of a log. The value of the `$body_bytes_sent` variable is aggregated across all requests in a session. The values of all other variables available for logging correspond to the first request in a session.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
