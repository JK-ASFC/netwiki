---
title: "server_name_in_redirect"
description: "Directive nginx server_name_in_redirect (ngx_http_core_module) — Active ou désactive l'utilisation du nom de serveur principal, défini par la directive server_name, dans les redirections absolues émises par nginx. Si elle est désactivée, le nom du champ d'en-tête…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_name_in_redirect on \| off;` |
| **Valeur par défaut** | `server_name_in_redirect off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'utilisation du nom de serveur principal, défini par la directive [[12-directives/server-name-http-core|server_name]], dans les redirections [[12-directives/absolute-redirect|absolues]] émises par nginx. Si elle est désactivée, le nom du champ d'en-tête de requête `Host` est utilisé ; à défaut, l'adresse IP du serveur.

L'utilisation d'un port dans les redirections est contrôlée par la directive [[12-directives/port-in-redirect|port_in_redirect]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
