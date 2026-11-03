---
title: "ngx_http_realip_module"
description: "Module nginx ngx_http_realip_module — Le module ngx_http_realip_module sert à remplacer l'adresse du client, et éventuellement son port, par ceux transmis dans le champ d'en-tête indiqué."
tags: [nginx, module, ngx_http_realip_module]
icon: puzzle
---

Le module `ngx_http_realip_module` sert à remplacer l'adresse du client, et éventuellement son port, par ceux transmis dans le champ d'en-tête indiqué.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_realip_module`.

## Exemple de configuration

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
