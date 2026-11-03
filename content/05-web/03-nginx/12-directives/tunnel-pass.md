---
title: "tunnel_pass"
description: "Directive nginx tunnel_pass (ngx_http_tunnel_module) — Active le traitement des requêtes CONNECT et définit l'adresse du serveur d'arrière-plan. Par défaut, l'adresse (address) vaut $host:$request_port et est prise dans la requête du client. Dans la…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_pass [address];` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Active le traitement des requêtes CONNECT et définit l'adresse du serveur d'arrière-plan. Par défaut, l'adresse (`address`) vaut *$host:$request\_port* et est prise dans la requête du client. Dans la plupart des cas, `tunnel_pass` ne nécessite aucun argument.

L'adresse peut être un nom de domaine ou une adresse IP, avec un port :

```nginx
tunnel_pass localhost:9000;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
tunnel_pass unix:/tmp/backend.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

La valeur du paramètre peut contenir des variables. Dans ce cas, si l'adresse est un nom de domaine, le nom est recherché parmi les [[11-modules/02-http/ngx_http_upstream_module|groupes de serveurs]] définis puis, s'il est introuvable, résolu à l'aide d'un [[12-directives/resolver-http-core|résolveur]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
