---
title: "session_log"
description: "Directive nginx session_log (ngx_http_session_log_module) — Enables the use of the specified session log. The special value off cancels the effect of the session_log directives inherited from the previous configuration level."
tags: [nginx, directive, ngx_http_session_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_log name \| off;` |
| **Valeur par défaut** | `session_log off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_session_log_module\|ngx_http_session_log_module]] |

## Utilisation

Enables the use of the specified session log. The special value `off` cancels the effect of the `session_log` directives inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
