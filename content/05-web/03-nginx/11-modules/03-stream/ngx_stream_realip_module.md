---
title: "ngx_stream_realip_module"
description: "Module nginx ngx_stream_realip_module — Le module ngx_stream_realip_module sert à remplacer l'adresse et le port du client par ceux envoyés dans l'en-tête du protocole PROXY (1.11.4). Le protocole PROXY doit d'abord être activé avec le paramètre…"
tags: [nginx, module, ngx_stream_realip_module]
icon: puzzle
---

Le module `ngx_stream_realip_module` sert à remplacer l'adresse et le port du client par ceux envoyés dans l'en-tête du protocole PROXY (1.11.4). Le protocole PROXY doit d'abord être activé avec le paramètre [[11-modules/03-stream/ngx_stream_core_module|proxy_protocol]] de la directive `listen`.

Ce module n'est pas compilé par défaut ; activez-le avec le paramètre de configuration `--with-stream_realip_module`.

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
