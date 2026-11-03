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

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

Parameter value can contain variables (1.17.8). In this case, if an address is specified as a domain name, the name is searched among the described [[11-modules/02-http/ngx_http_upstream_module|server groups]], and, if not found, is determined using a [[12-directives/resolver-http-core|resolver]].

> [!NOTE]
> Les champs de fin de réponse reçus d'un serveur amont sont transmis tels quels au client, sans interprétation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
