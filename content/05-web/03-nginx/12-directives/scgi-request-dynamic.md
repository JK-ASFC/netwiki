---
title: "scgi_request_dynamic"
description: "Directive nginx scgi_request_dynamic (ngx_http_scgi_module) — Active ou désactive la création d'une instance de requête distincte pour chaque serveur SCGI. Par défaut, une seule requête sert pour tous les serveurs SCGI. Si l'option est activée, une instance…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_request_dynamic on \| off;` |
| **Valeur par défaut** | `scgi_request_dynamic off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Active ou désactive la création d'une instance de requête distincte pour chaque serveur SCGI. Par défaut, une seule requête sert pour tous les serveurs SCGI. Si l'option est activée, une instance distincte est créée, ce qui permet de personnaliser la requête par serveur.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
