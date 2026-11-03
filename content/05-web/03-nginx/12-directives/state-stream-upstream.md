---
title: "state (ngx_stream_upstream_module)"
description: "Directive nginx state (ngx_stream_upstream_module) — Specifies a file that keeps the state of the dynamically configurable group. Examples: nginx state /var/lib/nginx/state/servers.conf; path for Linux state /var/db/nginx/state/servers.conf; path for…"
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

Specifies a *file* that keeps the state of the dynamically configurable group.

Examples:

```nginx
state /var/lib/nginx/state/servers.conf; # path for Linux
state /var/db/nginx/state/servers.conf;  # path for FreeBSD
```

The state is currently limited to the list of servers with their parameters. The file is read when parsing the configuration and is updated each time the upstream configuration is [[11-modules/02-http/ngx_http_api_module|changed]]. Changing the file content directly should be avoided. The directive cannot be used along with the [[12-directives/server-stream-upstream|server]] directive.

> [!NOTE]
> Changes made during [[10-guides/01-introduction/control|configuration reload]] or [[10-guides/01-introduction/control|binary upgrade]] can be lost.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
