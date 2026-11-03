---
title: "rewrite"
description: "Directive nginx rewrite (ngx_http_rewrite_module) — If the specified regular expression matches a request URI, URI is changed as specified in the replacement string. The rewrite directives are executed sequentially in order of their appearance in the…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `rewrite regex replacement [flag];` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

If the specified regular expression matches a request URI, URI is changed as specified in the *replacement* string. The `rewrite` directives are executed sequentially in order of their appearance in the configuration file. It is possible to terminate further processing of the directives using flags. If a replacement string starts with “`http://`”, “`https://`”, or “`$scheme`”, the processing stops and the redirect is returned to a client.

An optional *flag* parameter can be one of:

- **`last`**

  stops processing the current set of `ngx_http_rewrite_module` directives and starts a search for a new location matching the changed URI;

- **`break`**

  stops processing the current set of `ngx_http_rewrite_module` directives as with the [[12-directives/break|break]] directive;

- **`redirect`**

  returns a temporary redirect with the 302 code; used if a replacement string does not start with “`http://`”, “`https://`”, or “`$scheme`”;

- **`permanent`**

  returns a permanent redirect with the 301 code.

The full redirect URL is formed according to the request scheme (`$scheme`) and the [[12-directives/server-name-in-redirect|server_name_in_redirect]] and [[12-directives/port-in-redirect|port_in_redirect]] directives.

Example:

```nginx
server {
    ...
    rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 last;
    rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/$2.ra  last;
    return  403;
    ...
}
```

But if these directives are put inside the “`/download/`” location, the `last` flag should be replaced by `break`, or otherwise nginx will make 10 cycles and return the 500 error:

```nginx
location /download/ {
    rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 break;
    rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/$2.ra  break;
    return  403;
}
```

If a *replacement* string includes the new request arguments, the previous request arguments are appended after them. If this is undesired, putting a question mark at the end of a replacement string avoids having them appended, for example:

```nginx
rewrite ^/users/(.*)$ /show?user=$1? last;
```

If a regular expression includes the “`}`” or “`;`” characters, the whole expressions should be enclosed in single or double quotes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
