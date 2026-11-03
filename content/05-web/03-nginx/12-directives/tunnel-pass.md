---
title: "tunnel_pass"
description: "Directive nginx tunnel_pass (ngx_http_tunnel_module) — Enables handling of CONNECT requests and sets the address of a backend server. By default, the address is $host:$request_port and is taken from the client request. In most cases, tunnel_pass does not…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_pass [address];` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Enables handling of CONNECT requests and sets the address of a backend server. By default, the `address` is *$host:$request\_port* and is taken from the client request. In most cases, `tunnel_pass` does not require configuring any arguments.

The address can be specified as a domain name or IP address, and a port:

```nginx
tunnel_pass localhost:9000;
```

or as a UNIX-domain socket path:

```nginx
tunnel_pass unix:/tmp/backend.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

Parameter value can contain variables. In this case, if an address is specified as a domain name, the name is searched among the described [[11-modules/02-http/ngx_http_upstream_module|server groups]], and, if not found, is determined using a [[12-directives/resolver-http-core|resolver]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
