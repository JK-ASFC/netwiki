---
title: "ngx_http_access_module"
description: "Module nginx ngx_http_access_module — The ngx_http_access_module module allows limiting access to certain client addresses."
tags: [nginx, module, ngx_http_access_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_access_module` module allows limiting access to certain client addresses.

Access can also be limited by [[11-modules/02-http/ngx_http_auth_basic_module|password]], by the [[11-modules/02-http/ngx_http_auth_request_module|result of subrequest]], or by [[11-modules/02-http/ngx_http_auth_jwt_module|JWT]]. Simultaneous limitation of access by address and by password is controlled by the [[12-directives/satisfy|satisfy]] directive.

## Example Configuration

```nginx
location / {
    deny  192.168.1.1;
    allow 192.168.1.0/24;
    allow 10.1.1.0/16;
    allow 2001:0db8::/32;
    deny  all;
}
```

The rules are checked in sequence until the first match is found. In this example, access is allowed only for IPv4 networks `10.1.1.0/16` and `192.168.1.0/24` excluding the address `192.168.1.1`, and for IPv6 network `2001:0db8::/32`. In case of a lot of rules, the use of the [[11-modules/02-http/ngx_http_geo_module|ngx_http_geo_module]] module variables is preferable.

## Directives

- [[12-directives/allow-http-access|allow]]
- [[12-directives/deny-http-access|deny]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
