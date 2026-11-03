---
title: "proxy_redirect"
description: "Directive nginx proxy_redirect (ngx_http_proxy_module) — Sets the text that should be changed in the Location and Refresh header fields of a proxied server response. Suppose a proxied server returned the header field “Location:…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_redirect default;` ou `proxy_redirect off;` ou `proxy_redirect redirect replacement;` |
| **Valeur par défaut** | `proxy_redirect default;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets the text that should be changed in the `Location` and `Refresh` header fields of a proxied server response. Suppose a proxied server returned the header field “`Location: http://localhost:8000/two/some/uri/`”. The directive

```nginx
proxy_redirect http://localhost:8000/two/ http://frontend/one/;
```

will rewrite this string to “`Location: http://frontend/one/some/uri/`”.

A server name may be omitted in the *replacement* string:

```nginx
proxy_redirect http://localhost:8000/two/ /;
```

then the primary server’s name and port, if different from 80, will be inserted.

The default replacement specified by the `default` parameter uses the parameters of the [[12-directives/location|location]] and [[12-directives/proxy-pass-http-proxy|proxy_pass]] directives. Hence, the two configurations below are equivalent:

```nginx
location /one/ {
    proxy_pass     http://upstream:port/two/;
    proxy_redirect default;
```

```nginx
location /one/ {
    proxy_pass     http://upstream:port/two/;
    proxy_redirect http://upstream:port/two/ /one/;
```

The `default` parameter is not permitted if [[12-directives/proxy-pass-http-proxy|proxy_pass]] is specified using variables.

A *replacement* string can contain variables:

```nginx
proxy_redirect http://localhost:8000/ http://$host:$server_port/;
```

A *redirect* can also contain (1.1.11) variables:

```nginx
proxy_redirect http://$proxy_host:8000/ /;
```

The directive can be specified (1.1.11) using regular expressions. In this case, *redirect* should either start with the “`~`” symbol for a case-sensitive matching, or with the “`~*`” symbols for case-insensitive matching. The regular expression can contain named and positional captures, and *replacement* can reference them:

```nginx
proxy_redirect ~^(http://[^:]+):\d+(/.+)$ $1$2;
proxy_redirect ~*/user/([^/]+)/(.+)$      http://$1.example.com/$2;
```

Several `proxy_redirect` directives can be specified on the same level:

```nginx
proxy_redirect default;
proxy_redirect http://localhost:8000/  /;
proxy_redirect http://www.example.com/ /;
```

If several directives can be applied to the header fields of a proxied server response, the first matching directive will be chosen.

The `off` parameter cancels the effect of the `proxy_redirect` directives inherited from the previous configuration level.

Using this directive, it is also possible to add host names to relative redirects issued by a proxied server:

```nginx
proxy_redirect / /;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
