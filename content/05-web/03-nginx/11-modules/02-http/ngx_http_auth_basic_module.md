---
title: "ngx_http_auth_basic_module"
description: "Module nginx ngx_http_auth_basic_module — The ngx_http_auth_basic_module module allows limiting access to resources by validating the user name and password using the “HTTP Basic Authentication” protocol."
tags: [nginx, module, ngx_http_auth_basic_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_auth_basic_module` module allows limiting access to resources by validating the user name and password using the “HTTP Basic Authentication” protocol.

Access can also be limited by [[11-modules/02-http/ngx_http_access_module|address]], by the [[11-modules/02-http/ngx_http_auth_request_module|result of subrequest]], or by [[11-modules/02-http/ngx_http_auth_jwt_module|JWT]]. Simultaneous limitation of access by address and by password is controlled by the [[12-directives/satisfy|satisfy]] directive.

## Example Configuration

```nginx
location / {
    auth_basic           "closed site";
    auth_basic_user_file conf/htpasswd;
}
```

## Directives

- [[12-directives/auth-basic|auth_basic]]
- [[12-directives/auth-basic-user-file|auth_basic_user_file]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
