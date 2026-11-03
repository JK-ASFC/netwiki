---
title: "proxy_pass (ngx_stream_proxy_module)"
description: "Directive nginx proxy_pass (ngx_stream_proxy_module) — Sets the address of a proxied server. The address can be specified as a domain name or IP address, and a port: nginx proxy_pass localhost:12345; or as a UNIX-domain socket path: nginx proxy_pass…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Sets the address of a proxied server. The address can be specified as a domain name or IP address, and a port:

```nginx
proxy_pass localhost:12345;
```

or as a UNIX-domain socket path:

```nginx
proxy_pass unix:/tmp/stream.socket;
```

If a domain name resolves to several addresses, all of them will be used in a round-robin fashion. In addition, an address can be specified as a [[11-modules/03-stream/ngx_stream_upstream_module|server group]].

The address can also be specified using variables (1.11.3):

```nginx
proxy_pass $upstream;
```

In this case, the server name is searched among the described [[11-modules/03-stream/ngx_stream_upstream_module|server groups]], and, if not found, is determined using a [[12-directives/resolver-stream-core|resolver]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
