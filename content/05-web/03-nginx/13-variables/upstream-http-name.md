---
title: "$upstream_http_name"
description: "Variable nginx $upstream_http_name (ngx_http_upstream_module) — contiennent les champs d'en-tête de la réponse du serveur. Par exemple, le champ Server est accessible par la variable $upstream_http_server. Les règles de conversion des noms de champs en noms de…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_http_name` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

contiennent les champs d'en-tête de la réponse du serveur. Par exemple, le champ `Server` est accessible par la variable `$upstream_http_server`. Les règles de conversion des noms de champs en noms de variables sont les mêmes que pour les variables commençant par le préfixe « [[11-modules/02-http/ngx_http_core_module|$http_]] ». Seuls les champs de la réponse du dernier serveur sont conservés.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
