---
title: "ngx_mail_realip_module"
description: "Module nginx ngx_mail_realip_module — The ngx_mail_realip_module module is used to change the client address and port to the ones sent in the PROXY protocol header (1.19.8). The PROXY protocol must be previously enabled by setting the proxy_protocol…"
tags: [nginx, module, ngx_mail_realip_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_mail_realip_module` module is used to change the client address and port to the ones sent in the PROXY protocol header (1.19.8). The PROXY protocol must be previously enabled by setting the [[11-modules/04-mail/ngx_mail_core_module|proxy_protocol]] parameter in the `listen` directive.

## Exemple de configuration

```nginx
listen 110 proxy_protocol;

set_real_ip_from  192.168.1.0/24;
set_real_ip_from  192.168.2.1;
set_real_ip_from  2001:0db8::/32;
```

## Directives

- [[12-directives/set-real-ip-from-mail-realip|set_real_ip_from]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
