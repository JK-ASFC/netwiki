---
title: "grpc_pass"
description: "Directive nginx grpc_pass (ngx_http_grpc_module) — Définit l'adresse du serveur gRPC. L'adresse peut être un nom de domaine ou une adresse IP, avec un port : nginx grpc_pass localhost:9000; ou le chemin d'un socket de domaine UNIX : nginx grpc_pass…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Définit l'adresse du serveur gRPC. L'adresse peut être un nom de domaine ou une adresse IP, avec un port :

```nginx
grpc_pass localhost:9000;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
grpc_pass unix:/tmp/grpc.socket;
```

On peut aussi utiliser le schéma « `grpc://` » :

```nginx
grpc_pass grpc://127.0.0.1:9000;
```

Pour utiliser gRPC sur SSL, utiliser le schéma « `grpcs://` » :

```nginx
grpc_pass grpcs://127.0.0.1:443;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

La valeur du paramètre peut contenir des variables (1.17.8). Dans ce cas, si l'adresse est un nom de domaine, le nom est recherché parmi les [[11-modules/02-http/ngx_http_upstream_module|groupes de serveurs]] définis puis, s'il est introuvable, résolu à l'aide d'un [[12-directives/resolver-http-core|résolveur]].

> [!NOTE]
> Les champs de fin de réponse reçus d'un serveur amont sont transmis tels quels au client, sans interprétation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
