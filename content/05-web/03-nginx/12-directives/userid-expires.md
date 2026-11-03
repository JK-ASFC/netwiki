---
title: "userid_expires"
description: "Directive nginx userid_expires (ngx_http_userid_module) — Sets a time during which a browser should keep the cookie. The parameter max will cause the cookie to expire on “31 Dec 2037 23:55:55 GMT”. The parameter off will cause the cookie to expire at the…"
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_expires time \| max \| off;` |
| **Valeur par défaut** | `userid_expires off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Sets a time during which a browser should keep the cookie. The parameter `max` will cause the cookie to expire on “`31 Dec 2037 23:55:55 GMT`”. The parameter `off` will cause the cookie to expire at the end of a browser session.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
