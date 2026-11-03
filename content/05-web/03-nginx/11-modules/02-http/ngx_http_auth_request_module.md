---
title: "ngx_http_auth_request_module"
description: "Module nginx ngx_http_auth_request_module — The ngx_http_auth_request_module module (1.5.4+) implements client authorization based on the result of a subrequest. If the subrequest returns a 2xx response code, the access is allowed. If it returns 401 or 403, the…"
tags: [nginx, module, ngx_http_auth_request_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_auth_request_module` module (1.5.4+) implements client authorization based on the result of a subrequest. If the subrequest returns a 2xx response code, the access is allowed. If it returns 401 or 403, the access is denied with the corresponding error code. Any other response code returned by the subrequest is considered an error.

For the 401 error, the client also receives the `WWW-Authenticate` header from the subrequest response.

This module is not built by default, it should be enabled with the `--with-http_auth_request_module` configuration parameter.

The module may be combined with other access modules, such as [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]], and [[11-modules/02-http/ngx_http_auth_jwt_module|ngx_http_auth_jwt_module]], via the [[12-directives/satisfy|satisfy]] directive.

> [!NOTE]
> Before version 1.7.3, responses to authorization subrequests could not be cached (using [[12-directives/proxy-cache|proxy_cache]], [[12-directives/proxy-store|proxy_store]], etc.).

## Exemple de configuration

```nginx
location /private/ {
    auth_request /auth;
    ...
}

location = /auth {
    proxy_pass ...
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```

## Directives

- [[12-directives/auth-request|auth_request]]
- [[12-directives/auth-request-set|auth_request_set]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
