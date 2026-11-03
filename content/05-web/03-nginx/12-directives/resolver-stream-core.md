---
title: "resolver (ngx_stream_core_module)"
description: "Directive nginx resolver (ngx_stream_core_module) — Configures name servers used to resolve names of upstream servers into addresses, for example: nginx resolver 127.0.0.1 ::1:5353; The address can be specified as a domain name or IP address, with an…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver address ... [valid=time] [ipv4=on\|off] [ipv6=on\|off] [status_zone=zone];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Configures name servers used to resolve names of upstream servers into addresses, for example:

```nginx
resolver 127.0.0.1 [::1]:5353;
```

The address can be specified as a domain name or IP address, with an optional port. If port is not specified, the port 53 is used. Name servers are queried in a round-robin fashion.

By default, nginx will look up both IPv4 and IPv6 addresses while resolving. If looking up of IPv4 or IPv6 addresses is not desired, the `ipv4=off` (1.23.1) or the `ipv6=off` parameter can be specified.

By default, nginx caches answers using the TTL value of a response. The optional `valid` parameter allows overriding it:

```nginx
resolver 127.0.0.1 [::1]:5353 valid=30s;
```

> [!NOTE]
> To prevent DNS spoofing, it is recommended configuring DNS servers in a properly secured trusted local network.

The optional `status_zone` parameter (1.17.1) enables [[11-modules/02-http/ngx_http_api_module|collection]] of DNS server statistics of requests and responses in the specified *zone*. The parameter is available as part of our [abonnement commercial](https://nginx.com/products/).

> [!NOTE]
> Before version 1.11.3, this directive was available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
