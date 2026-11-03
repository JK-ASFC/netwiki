---
title: "userid_p3p"
description: "Directive nginx userid_p3p (ngx_http_userid_module) — Sets a value for the P3P header field that will be sent along with the cookie. If the directive is set to the special value none, the P3P header will not be sent in a response."
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_p3p string \| none;` |
| **Valeur par défaut** | `userid_p3p none;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Sets a value for the `P3P` header field that will be sent along with the cookie. If the directive is set to the special value `none`, the `P3P` header will not be sent in a response.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
