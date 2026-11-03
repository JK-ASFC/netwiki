---
title: "location"
description: "Directive nginx location (ngx_http_core_module) — Sets configuration depending on a request URI or the value of a variable (1.31.5). The matching is performed against a normalized URI, after decoding the text encoded in the “%XX” form, resolving…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `location [ = \| ~ \| ~* \| ^~ ] uri { ... }` ou `location $variable { ... }` ou `location @name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets configuration depending on a request URI or the value of a variable (1.31.5).

The matching is performed against a normalized URI, after decoding the text encoded in the “`%XX`” form, resolving references to relative path components “`.`” and “`..`”, and possible [[12-directives/merge-slashes|compression]] of two or more adjacent slashes into a single slash.

A location can be defined by a prefix string, a regular expression, or a predicate (1.31.5). Regular expressions are specified with the preceding “`~*`” modifier (for case-insensitive matching), or the “`~`” modifier (for case-sensitive matching). A predicate is specified with the preceding “`$`” and contains a variable evaluated during request processing. A predicate location matches if the variable value is not empty and is not equal to “0”.

> [!NOTE]
> The value of a cacheable variable is evaluated once per request, and is also used when locations are searched after an internal redirect and in subrequests. To evaluate a predicate on each location search, a non-cacheable variable can be used, for example, a [[12-directives/map-http-map|map]] variable with the `volatile` parameter.

To find location matching a given request, nginx first checks locations defined using the prefix strings (prefix locations). Among them, the location with the longest matching prefix is selected and remembered. Then regular expressions are checked, in the order of their appearance in the configuration file. The search of regular expressions terminates on the first match, and the corresponding configuration is used. If no match with a regular expression is found, predicate locations are checked in the order of their appearance in the configuration file. If no predicate location matches, the configuration of the prefix location remembered earlier is used.

`location` blocks can be nested, with some exceptions mentioned below.

For case-insensitive operating systems such as macOS and Cygwin, matching with prefix strings ignores a case (0.7.7). However, comparison is limited to one-byte locales.

Regular expressions can contain captures (0.7.40) that can later be used in other directives, see [[10-guides/01-introduction/regex-captures|Regular expression captures]].

If the longest matching prefix location has the “`^~`” modifier, then regular expressions and predicate locations are not checked.

Also, using the “`=`” modifier it is possible to define an exact match of URI and location. If an exact match is found, the search terminates. For example, if a “`/`” request happens frequently, defining “`location = /`” will speed up the processing of these requests, as search terminates right after the first comparison. Such a location cannot obviously contain nested locations.

> [!NOTE]
> In versions from 0.7.1 to 0.8.41, if a request matched the prefix location without the “`=`” and “`^~`” modifiers, the search also terminated and regular expressions were not checked.

Let’s illustrate the above by an example:

```nginx
location = / {
    [ configuration A ]
}

location / {
    [ configuration B ]
}

location /documents/ {
    [ configuration C ]
}

location ^~ /images/ {
    [ configuration D ]
}

location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}

location $arg_pred {
    [ configuration F ]
}
```

The “`/`” request will match configuration A, the “`/index.html`” request will match configuration B, the “`/documents/document.html`” request will match configuration C, the “`/images/1.gif`” request will match configuration D, the “`/documents/1.jpg`” request will match configuration E, and the “`/documents/index.html?pred=1`” request will match configuration F.

The “`@`” prefix defines a named location. Such a location is not used for a regular request processing, but instead used for request redirection. They cannot be nested, and cannot contain nested locations.

If a location is defined by a prefix string that ends with the slash character, and requests are processed by one of [[12-directives/proxy-pass-http-proxy|proxy_pass]], [[12-directives/fastcgi-pass|fastcgi_pass]], [[12-directives/uwsgi-pass|uwsgi_pass]], [[12-directives/scgi-pass|scgi_pass]], [[12-directives/memcached-pass|memcached_pass]], or [[12-directives/grpc-pass|grpc_pass]], then the special processing is performed. In response to a request with URI equal to this string, but without the trailing slash, a permanent redirect with the code 301 will be returned to the requested URI with the slash appended. If this is not desired, an exact match of the URI and location could be defined like this:

```nginx
location /user/ {
    proxy_pass http://user.example.com;
}

location = /user {
    proxy_pass http://login.example.com;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
