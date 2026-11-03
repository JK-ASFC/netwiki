---
title: "proxy_cookie_flags"
description: "Directive nginx proxy_cookie_flags (ngx_http_proxy_module) — Sets one or more flags for the cookie. The cookie can contain text, variables, and their combinations. The flag can contain text, variables, and their combinations (1.19.8). The secure, httponly,…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cookie_flags off \| cookie [flag ...];` |
| **Valeur par défaut** | `proxy_cookie_flags off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.19.3 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets one or more flags for the cookie. The *cookie* can contain text, variables, and their combinations. The *flag* can contain text, variables, and their combinations (1.19.8). The `secure`, `httponly`, `samesite=strict`, `samesite=lax`, `samesite=none` parameters add the corresponding flags. The `nosecure`, `nohttponly`, `nosamesite` parameters remove the corresponding flags.

The cookie can also be specified using regular expressions. In this case, *cookie* should start from the “`~`” symbol.

Several `proxy_cookie_flags` directives can be specified on the same configuration level:

```nginx
proxy_cookie_flags one httponly;
proxy_cookie_flags ~ nosecure samesite=strict;
```

If several directives can be applied to the cookie, the first matching directive will be chosen. In the example, the `httponly` flag is added to the cookie `one`, for all other cookies the `samesite=strict` flag is added and the `secure` flag is deleted.

The `off` parameter cancels the effect of the `proxy_cookie_flags` directives inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
