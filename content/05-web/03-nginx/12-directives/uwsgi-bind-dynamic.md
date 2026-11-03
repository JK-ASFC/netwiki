---
title: "uwsgi_bind_dynamic"
description: "Directive nginx uwsgi_bind_dynamic (ngx_http_uwsgi_module) — Si cette option est activée, l'opération bind est effectuée à chaque tentative de connexion. NOTE Cette directive est disponible dans le cadre de notre abonnement commercial."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_bind_dynamic on \| off;` |
| **Valeur par défaut** | `uwsgi_bind_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Si cette option est activée, l'opération [[12-directives/uwsgi-bind|bind]] est effectuée à chaque tentative de connexion.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
