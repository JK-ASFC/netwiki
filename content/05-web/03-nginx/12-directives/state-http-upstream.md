---
title: "state (ngx_http_upstream_module)"
description: "Directive nginx state (ngx_http_upstream_module) — Indique le fichier (file) qui conserve l'état du groupe configurable dynamiquement. Exemples : nginx state /var/lib/nginx/state/servers.conf; path for Linux state /var/db/nginx/state/servers.conf;…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `state file;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.9.7 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Indique le fichier (*file*) qui conserve l'état du groupe configurable dynamiquement.

Exemples :

```nginx
state /var/lib/nginx/state/servers.conf; # path for Linux
state /var/db/nginx/state/servers.conf;  # path for FreeBSD
```

L'état se limite actuellement à la liste des serveurs et de leurs paramètres. Le fichier est lu lors de l'analyse de la configuration et mis à jour à chaque [[11-modules/02-http/ngx_http_api_module|modification]] de la configuration du groupe amont. Il faut éviter de modifier directement son contenu. La directive ne peut pas être utilisée avec la directive [[12-directives/server-http-upstream|server]].

> [!NOTE]
> Les modifications faites pendant un [[10-guides/01-introduction/control|rechargement de la configuration]] ou une [[10-guides/01-introduction/control|mise à jour de l'exécutable]] peuvent être perdues.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
