---
title: "grpc_request_dynamic"
description: "Directive nginx grpc_request_dynamic (ngx_http_grpc_module) — Active ou désactive la création d'une instance de requête distincte pour chaque serveur gRPC. Par défaut, une seule requête sert pour tous les serveurs gRPC. Si l'option est activée, une instance…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_request_dynamic on \| off;` |
| **Valeur par défaut** | `grpc_request_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Active ou désactive la création d'une instance de requête distincte pour chaque serveur gRPC. Par défaut, une seule requête sert pour tous les serveurs gRPC. Si l'option est activée, une instance distincte est créée, ce qui permet de personnaliser la requête par serveur. Par exemple, on peut définir un champ d'en-tête `Host` propre à chaque serveur :

```nginx
grpc_request_dynamic on;
grpc_set_header      Host $upstream_last_server_name;
```

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
