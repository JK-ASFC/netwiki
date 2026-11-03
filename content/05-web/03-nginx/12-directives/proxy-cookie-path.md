---
title: "proxy_cookie_path"
description: "Directive nginx proxy_cookie_path (ngx_http_proxy_module) — Sets a text that should be changed in the path attribute of the Set-Cookie header fields of a proxied server response. Suppose a proxied server returned the Set-Cookie header field with the attribute…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cookie_path off;` ou `proxy_cookie_path path replacement;` |
| **Valeur par défaut** | `proxy_cookie_path off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.15 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets a text that should be changed in the `path` attribute of the `Set-Cookie` header fields of a proxied server response. Suppose a proxied server returned the `Set-Cookie` header field with the attribute “`path=/two/some/uri/`”. The directive

```nginx
proxy_cookie_path /two/ /;
```

will rewrite this attribute to “`path=/some/uri/`”.

The *path* and *replacement* strings can contain variables:

```nginx
proxy_cookie_path $uri /some$uri;
```

The directive can also be specified using regular expressions. In this case, *path* should either start from the “`~`” symbol for a case-sensitive matching, or from the “`~*`” symbols for case-insensitive matching. The regular expression can contain named and positional captures, and *replacement* can reference them:

```nginx
proxy_cookie_path ~*^/user/([^/]+) /u/$1;
```

Several `proxy_cookie_path` directives can be specified on the same level:

```nginx
proxy_cookie_path /one/ /;
proxy_cookie_path / /two/;
```

If several directives can be applied to the cookie, the first matching directive will be chosen.

The `off` parameter cancels the effect of the `proxy_cookie_path` directives inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
