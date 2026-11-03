---
title: "$uid_reset"
description: "Variable nginx $uid_reset (ngx_http_userid_module) — Si la variable reçoit une chaîne non vide différente de « 0 », les identifiants des clients sont réinitialisés. La valeur spéciale « log » écrit en plus dans error_log des messages sur les…"
tags: [nginx, variable, ngx_http_userid_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$uid_reset` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

Si la variable reçoit une chaîne non vide différente de « `0` », les identifiants des clients sont réinitialisés. La valeur spéciale « `log` » écrit en plus dans [[12-directives/error-log|error_log]] des messages sur les identifiants réinitialisés.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
