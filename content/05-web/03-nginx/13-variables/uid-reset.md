---
title: "$uid_reset"
description: "Variable nginx $uid_reset (ngx_http_userid_module) — If the variable is set to a non-empty string that is not “0”, the client identifiers are reset. The special value “log” additionally leads to the output of messages about the reset identifiers to the…"
tags: [nginx, variable, ngx_http_userid_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$uid_reset` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

If the variable is set to a non-empty string that is not “`0`”, the client identifiers are reset. The special value “`log`” additionally leads to the output of messages about the reset identifiers to the [[12-directives/error-log|error_log]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
