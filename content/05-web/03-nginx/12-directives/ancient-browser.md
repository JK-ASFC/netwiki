---
title: "ancient_browser"
description: "Directive nginx ancient_browser (ngx_http_browser_module) — Si l'une des sous-chaînes indiquées figure dans le champ d'en-tête de requête User-Agent, le navigateur est considéré comme ancien. La chaîne spéciale « netscape4 » correspond à l'expression…"
tags: [nginx, directive, ngx_http_browser_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ancient_browser string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_browser_module\|ngx_http_browser_module]] |

## Utilisation

Si l'une des sous-chaînes indiquées figure dans le champ d'en-tête de requête `User-Agent`, le navigateur est considéré comme ancien. La chaîne spéciale « `netscape4` » correspond à l'expression régulière « `^Mozilla/[1-4]` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
