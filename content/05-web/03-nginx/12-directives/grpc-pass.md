---
title: "grpc_pass"
description: "Directive nginx grpc_pass (ngx_http_grpc_module) — Sets the gRPC server address. The address can be specified as a domain name or IP address, and a port: nginx grpc_pass localhost:9000; or as a UNIX-domain socket path: nginx grpc_pass…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Sets the gRPC server address. The address can be specified as a domain name or IP address, and a port:

```nginx
grpc_pass localhost:9000;
```

or as a UNIX-domain socket path:

```nginx
grpc_pass unix:/tmp/grpc.socket;
```

Alternatively, the “`grpc://`” scheme can be used:

```nginx
grpc_pass grpc://127.0.0.1:9000;
```

To use gRPC over SSL, the “`grpcs://`” scheme should be used:

```nginx
grpc_pass grpcs://127.0.0.1:443;
```

If a domain name resolves to several addresses, all of them will be used in a round-robin fashion. In addition, an address can be specified as a [[11-modules/02-http/ngx_http_upstream_module|server group]].

Parameter value can contain variables (1.17.8). In this case, if an address is specified as a domain name, the name is searched among the described [[11-modules/02-http/ngx_http_upstream_module|server groups]], and, if not found, is determined using a [[12-directives/resolver-http-core|resolver]].

> [!NOTE]
> Trailer fields received from an upstream server are passed to a client as is, without interpretation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
