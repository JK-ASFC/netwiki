---
title: "server (ngx_http_core_module)"
description: "Directive nginx server (ngx_http_core_module) — Définit la configuration d'un serveur virtuel. Il n'y a pas de séparation nette entre serveurs virtuels par adresse IP et par nom (selon le champ d'en-tête de requête Host). Les directives listen…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la configuration d'un serveur virtuel. Il n'y a pas de séparation nette entre serveurs virtuels par adresse IP et par nom (selon le champ d'en-tête de requête `Host`). Les directives [[12-directives/listen-http-core|listen]] décrivent toutes les adresses et tous les ports sur lesquels le serveur accepte des connexions, et la directive [[12-directives/server-name-http-core|server_name]] liste tous les noms du serveur. Des exemples de configuration figurent dans le document « [[10-guides/02-http/request-processing|Comment nginx traite une requête]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
