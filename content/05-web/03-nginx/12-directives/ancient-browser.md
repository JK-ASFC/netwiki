---
title: "ancient_browser"
description: "Directive nginx ancient_browser (ngx_http_browser_module) — If any of the specified substrings is found in the User-Agent request header field, the browser will be considered ancient. The special string “netscape4” corresponds to the regular expression…"
tags: [nginx, directive, ngx_http_browser_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ancient_browser string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_browser_module\|ngx_http_browser_module]] |

## Utilisation

If any of the specified substrings is found in the `User-Agent` request header field, the browser will be considered ancient. The special string “`netscape4`” corresponds to the regular expression “`^Mozilla/[1-4]`”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
