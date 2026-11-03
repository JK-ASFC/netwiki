---
title: "ngx_http_realip_module"
description: "Module nginx ngx_http_realip_module — The ngx_http_realip_module module is used to change the client address and optional port to those sent in the specified header field."
tags: [nginx, module, ngx_http_realip_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_realip_module` module is used to change the client address and optional port to those sent in the specified header field.

This module is not built by default, it should be enabled with the `--with-http_realip_module` configuration parameter.

## Example Configuration

```nginx
set_real_ip_from  192.168.1.0/24;
set_real_ip_from  192.168.2.1;
set_real_ip_from  2001:0db8::/32;
real_ip_header    X-Forwarded-For;
real_ip_recursive on;
```

## Directives

- [[12-directives/set-real-ip-from-http-realip|set_real_ip_from]]
- [[12-directives/real-ip-header|real_ip_header]]
- [[12-directives/real-ip-recursive|real_ip_recursive]]

## Variables intégrées

- [[13-variables/realip-remote-addr-http-realip|$realip_remote_addr]]
- [[13-variables/realip-remote-port-http-realip|$realip_remote_port]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
