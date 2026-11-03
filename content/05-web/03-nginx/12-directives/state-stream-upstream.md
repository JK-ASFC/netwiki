---
title: "state (ngx_stream_upstream_module)"
description: "Directive nginx state (ngx_stream_upstream_module) — Indique le fichier (file) qui conserve l'état du groupe configurable dynamiquement. Exemples : nginx state /var/lib/nginx/state/servers.conf; path for Linux state /var/db/nginx/state/servers.conf;…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `state file;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.9.7 |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Indique le fichier (*file*) qui conserve l'état du groupe configurable dynamiquement.

Exemples :

```nginx
state /var/lib/nginx/state/servers.conf; # path for Linux
state /var/db/nginx/state/servers.conf;  # path for FreeBSD
```

The state is currently limited to the list of servers with their parameters. The file is read when parsing the configuration and is updated each time the upstream configuration is [[11-modules/02-http/ngx_http_api_module|changed]]. Changing the file content directly should be avoided. The directive cannot be used along with the [[12-directives/server-stream-upstream|server]] directive.

> [!NOTE]
> Les modifications faites pendant un [[10-guides/01-introduction/control|rechargement de la configuration]] ou une [[10-guides/01-introduction/control|mise à jour de l'exécutable]] peuvent être perdues.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
