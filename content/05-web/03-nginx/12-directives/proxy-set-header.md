---
title: "proxy_set_header"
description: "Directive nginx proxy_set_header (ngx_http_proxy_module) — Allows redefining or appending fields to the request header passed to the proxied server. The value can contain text, variables, and their combinations. These directives are inherited from the…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_set_header field value;` |
| **Valeur par défaut** | `proxy_set_header Host $proxy_host;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Allows redefining or appending fields to the request header [[12-directives/proxy-pass-request-headers|passed]] to the proxied server. The *value* can contain text, variables, and their combinations. These directives are inherited from the previous configuration level if and only if there are no `proxy_set_header` directives defined on the current level.

By default, the header fields `Host` and `Connection` from the original request are not passed to the proxied server. If HTTP/1.0 or HTTP/1.1 is [[12-directives/proxy-http-version|enabled]] for proxying, these fields are redefined:

```nginx
proxy_set_header Host       $proxy_host;
proxy_set_header Connection close;
```

For HTTP/2, the `:authority` pseudo-header field with the *$proxy\_host* value is sent by default, unless it is replaced with an explicit `Host` header field.

If caching is enabled, the header fields `If-Modified-Since`, `If-Unmodified-Since`, `If-None-Match`, `If-Match`, `Range`, and `If-Range` from the original request are not passed to the proxied server.

An unchanged `Host` request header field can be passed like this:

```nginx
proxy_set_header Host       $http_host;
```

However, if this field is not present in a client request header then nothing will be passed. In such a case it is better to use the `$host` variable — its value equals the server name in the `Host` request header field or the primary server name if this field is not present:

```nginx
proxy_set_header Host       $host;
```

In addition, the server name can be passed together with the port of the proxied server:

```nginx
proxy_set_header Host       $host:$proxy_port;
```

If the value of a header field is an empty string then this field will not be passed to a proxied server:

```nginx
proxy_set_header Accept-Encoding "";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
