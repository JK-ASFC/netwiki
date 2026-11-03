---
title: "ngx_stream_access_module"
description: "Module nginx ngx_stream_access_module — The ngx_stream_access_module module (1.9.2) allows limiting access to certain client addresses."
tags: [nginx, module, ngx_stream_access_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_access_module` module (1.9.2) allows limiting access to certain client addresses.

## Exemple de configuration

```nginx
server {
    ...
    deny  192.168.1.1;
    allow 192.168.1.0/24;
    allow 10.1.1.0/16;
    allow 2001:0db8::/32;
    deny  all;
}
```

The rules are checked in sequence until the first match is found. In this example, access is allowed only for IPv4 networks `10.1.1.0/16` and `192.168.1.0/24` excluding the address `192.168.1.1`, and for IPv6 network `2001:0db8::/32`.

## Directives

- [[12-directives/allow-stream-access|allow]]
- [[12-directives/deny-stream-access|deny]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
