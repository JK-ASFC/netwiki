---
title: "zone_sync_server"
description: "Directive nginx zone_sync_server (ngx_stream_zone_sync_module) — Defines the address of a cluster node. The address can be specified as a domain name or IP address with a mandatory port, or as a UNIX-domain socket path specified after the “unix:” prefix. A domain…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_server address [resolve];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Defines the *address* of a cluster node. The address can be specified as a domain name or IP address with a mandatory port, or as a UNIX-domain socket path specified after the “`unix:`” prefix. A domain name that resolves to several IP addresses defines multiple nodes at once.

The `resolve` parameter instructs nginx to monitor changes of the IP addresses that correspond to a domain name of the node and automatically modify the configuration without the need of restarting nginx.

Cluster nodes are specified either dynamically as a single `zone_sync_server` directive with the `resolve` parameter, or statically as a series of several directives without the parameter.

> [!NOTE]
> Each cluster node should be specified only once.

> [!NOTE]
> All cluster nodes should use the same configuration.

In order for the `resolve` parameter to work, the [[12-directives/resolver-stream-core|resolver]] directive must be specified in the [[12-directives/stream|stream]] block. Example:

```nginx
stream {
    resolver 10.0.0.1;

    server {
        zone_sync;
        zone_sync_server cluster.example.com:12345 resolve;
        ...
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
