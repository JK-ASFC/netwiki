---
title: "proxy_cookie_domain"
description: "Directive nginx proxy_cookie_domain (ngx_http_proxy_module) — Sets a text that should be changed in the domain attribute of the Set-Cookie header fields of a proxied server response. Suppose a proxied server returned the Set-Cookie header field with the…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cookie_domain off;` ou `proxy_cookie_domain domain replacement;` |
| **Valeur par défaut** | `proxy_cookie_domain off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.15 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets a text that should be changed in the `domain` attribute of the `Set-Cookie` header fields of a proxied server response. Suppose a proxied server returned the `Set-Cookie` header field with the attribute “`domain=localhost`”. The directive

```nginx
proxy_cookie_domain localhost example.org;
```

will rewrite this attribute to “`domain=example.org`”.

A dot at the beginning of the *domain* and *replacement* strings and the `domain` attribute is ignored. Matching is case-insensitive.

The *domain* and *replacement* strings can contain variables:

```nginx
proxy_cookie_domain www.$host $host;
```

The directive can also be specified using regular expressions. In this case, *domain* should start from the “`~`” symbol. A regular expression can contain named and positional captures, and *replacement* can reference them:

```nginx
proxy_cookie_domain ~\.(?P<sl_domain>[-0-9a-z]+\.[a-z]+)$ $sl_domain;
```

Several `proxy_cookie_domain` directives can be specified on the same level:

```nginx
proxy_cookie_domain localhost example.org;
proxy_cookie_domain ~\.([a-z]+\.[a-z]+)$ $1;
```

If several directives can be applied to the cookie, the first matching directive will be chosen.

The `off` parameter cancels the effect of the `proxy_cookie_domain` directives inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
