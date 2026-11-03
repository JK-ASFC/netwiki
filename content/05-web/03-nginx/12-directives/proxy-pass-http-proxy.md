---
title: "proxy_pass (ngx_http_proxy_module)"
description: "Directive nginx proxy_pass (ngx_http_proxy_module) — Sets the protocol and address of a proxied server and an optional URI to which a location should be mapped. As a protocol, “http” or “https” can be specified. The address can be specified as a domain…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets the protocol and address of a proxied server and an optional URI to which a location should be mapped. As a protocol, “`http`” or “`https`” can be specified. The address can be specified as a domain name or IP address, and an optional port:

```nginx
proxy_pass http://localhost:8000/uri/;
```

or as a UNIX-domain socket path specified after the word “`unix`” and enclosed in colons:

```nginx
proxy_pass http://unix:/tmp/backend.socket:/uri/;
```

If a domain name resolves to several addresses, all of them will be used in a round-robin fashion. In addition, an address can be specified as a [[11-modules/02-http/ngx_http_upstream_module|server group]].

Parameter value can contain variables. In this case, if an address is specified as a domain name, the name is searched among the described server groups, and, if not found, is determined using a [[12-directives/resolver-http-core|resolver]].

A request URI is passed to the server as follows:

- If the `proxy_pass` directive is specified with a URI, then when a request is passed to the server, the part of a [[12-directives/location|normalized]] request URI matching the location is replaced by a URI specified in the directive:

  ```nginx
  location /name/ {
      proxy_pass http://127.0.0.1/remote/;
  }
  ```

- If `proxy_pass` is specified without a URI, the request URI is passed to the server in the same form as sent by a client when the original request is processed, or the full normalized request URI is passed when processing the changed URI:

  ```nginx
  location /some/path/ {
      proxy_pass http://127.0.0.1;
  }
  ```

  > [!NOTE]
  > Before version 1.1.12, if `proxy_pass` is specified without a URI, the original request URI might be passed instead of the changed URI in some cases.

In some cases, the part of a request URI to be replaced cannot be determined:

- When location is specified using a regular expression, and also inside named locations.

  In these cases, `proxy_pass` should be specified without a URI.

- When the URI is changed inside a proxied location using the [[12-directives/rewrite|rewrite]] directive, and this same configuration will be used to process a request (`break`):

  ```nginx
  location /name/ {
      rewrite    /name/([^/]+) /users?name=$1 break;
      proxy_pass http://127.0.0.1;
  }
  ```

  In this case, the URI specified in the directive is ignored and the full changed request URI is passed to the server.

- When variables are used in `proxy_pass`:

  ```nginx
  location /name/ {
      proxy_pass http://127.0.0.1$request_uri;
  }
  ```

  In this case, if URI is specified in the directive, it is passed to the server as is, replacing the original request URI.

[[10-guides/02-http/websocket|WebSocket]] proxying requires special configuration and is supported since version 1.3.13.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
