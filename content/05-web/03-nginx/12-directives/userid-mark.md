---
title: "userid_mark"
description: "Directive nginx userid_mark (ngx_http_userid_module) — If the parameter is not off, enables the cookie marking mechanism and sets the character used as a mark. This mechanism is used to add or change userid_p3p and/or a cookie expiration time while…"
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_mark letter \| digit \| = \| off;` |
| **Valeur par défaut** | `userid_mark off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

If the parameter is not `off`, enables the cookie marking mechanism and sets the character used as a mark. This mechanism is used to add or change [[12-directives/userid-p3p|userid_p3p]] and/or a cookie expiration time while preserving the client identifier. A mark can be any letter of the English alphabet (case-sensitive), digit, or the “`=`” character.

If the mark is set, it is compared with the first padding symbol in the base64 representation of the client identifier passed in a cookie. If they do not match, the cookie is resent with the specified mark, expiration time, and `P3P` header.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
