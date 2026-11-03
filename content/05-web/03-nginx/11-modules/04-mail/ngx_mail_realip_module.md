---
title: "ngx_mail_realip_module"
description: "Module nginx ngx_mail_realip_module — Le module ngx_mail_realip_module sert à remplacer l'adresse et le port du client par ceux transmis dans l'en-tête du protocole PROXY (1.19.8). Le protocole PROXY doit au préalable être activé avec le paramètre…"
tags: [nginx, module, ngx_mail_realip_module]
icon: puzzle
---

Le module `ngx_mail_realip_module` sert à remplacer l'adresse et le port du client par ceux transmis dans l'en-tête du protocole PROXY (1.19.8). Le protocole PROXY doit au préalable être activé avec le paramètre [[11-modules/04-mail/ngx_mail_core_module|proxy_protocol]] de la directive `listen`.

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
