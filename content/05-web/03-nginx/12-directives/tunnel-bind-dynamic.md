---
title: "tunnel_bind_dynamic"
description: "Directive nginx tunnel_bind_dynamic (ngx_http_tunnel_module) — When enabled, makes the tunnel_bind operation at each connection attempt: nginx geo $upstream_last_addr $bind_addr { volatile; 10.0.0.0/24 10.0.0.1; 192.168.0.0/24 192.168.0.1; } tunnel_bind…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_bind_dynamic on \| off;` |
| **Valeur par défaut** | `tunnel_bind_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

When enabled, makes the [[12-directives/tunnel-bind|tunnel_bind]] operation at each connection attempt:

```nginx
geo $upstream_last_addr $bind_addr {
    volatile;
    10.0.0.0/24    10.0.0.1;
    192.168.0.0/24  192.168.0.1;
}

tunnel_bind         $bind_addr;
tunnel_bind_dynamic on;
```

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
