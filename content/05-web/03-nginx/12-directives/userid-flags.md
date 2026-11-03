---
title: "userid_flags"
description: "Directive nginx userid_flags (ngx_http_userid_module) — Si le paramètre n'est pas off, définit un ou plusieurs attributs supplémentaires du cookie : secure, httponly, samesite=strict, samesite=lax, samesite=none."
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_flags off \| flag ...;` |
| **Valeur par défaut** | `userid_flags off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.19.3 |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Si le paramètre n'est pas `off`, définit un ou plusieurs attributs supplémentaires du cookie : `secure`, `httponly`, `samesite=strict`, `samesite=lax`, `samesite=none`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
