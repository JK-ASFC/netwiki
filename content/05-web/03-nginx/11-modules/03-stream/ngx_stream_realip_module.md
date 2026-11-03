---
title: "ngx_stream_realip_module"
description: "Module nginx ngx_stream_realip_module — The ngx_stream_realip_module module is used to change the client address and port to the ones sent in the PROXY protocol header (1.11.4). The PROXY protocol must be previously enabled by setting the proxy_protocol…"
tags: [nginx, module, ngx_stream_realip_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_realip_module` module is used to change the client address and port to the ones sent in the PROXY protocol header (1.11.4). The PROXY protocol must be previously enabled by setting the [[11-modules/03-stream/ngx_stream_core_module|proxy_protocol]] parameter in the `listen` directive.

This module is not built by default, it should be enabled with the `--with-stream_realip_module` configuration parameter.

## Exemple de configuration

```nginx
listen 12345 proxy_protocol;

set_real_ip_from  192.168.1.0/24;
set_real_ip_from  192.168.2.1;
set_real_ip_from  2001:0db8::/32;
```

## Directives

- [[12-directives/set-real-ip-from-stream-realip|set_real_ip_from]]

## Variables intégrées

- [[13-variables/realip-remote-addr-stream-realip|$realip_remote_addr]]
- [[13-variables/realip-remote-port-stream-realip|$realip_remote_port]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
