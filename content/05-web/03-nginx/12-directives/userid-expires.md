---
title: "userid_expires"
description: "Directive nginx userid_expires (ngx_http_userid_module) — Définit la durée pendant laquelle le navigateur doit conserver le cookie. Le paramètre max le fait expirer le « 31 Dec 2037 23:55:55 GMT », le paramètre off à la fin de la session du navigateur."
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_expires time \| max \| off;` |
| **Valeur par défaut** | `userid_expires off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Définit la durée pendant laquelle le navigateur doit conserver le cookie. Le paramètre `max` le fait expirer le « `31 Dec 2037 23:55:55 GMT` », le paramètre `off` à la fin de la session du navigateur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
