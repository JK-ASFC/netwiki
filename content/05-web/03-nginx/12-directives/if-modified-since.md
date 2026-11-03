---
title: "if_modified_since"
description: "Directive nginx if_modified_since (ngx_http_core_module) — Indique comment comparer la date de modification d'une réponse avec l'heure du champ d'en-tête de requête If-Modified-Since : - off la réponse est toujours considérée comme modifiée (0.7.34) ; -…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `if_modified_since off \| exact \| before;` |
| **Valeur par défaut** | `if_modified_since exact;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.24 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Indique comment comparer la date de modification d'une réponse avec l'heure du champ d'en-tête de requête `If-Modified-Since` :

- **`off`**

  la réponse est toujours considérée comme modifiée (0.7.34) ;

- **`exact`**

  correspondance exacte ;

- **`before`**

  la date de modification de la réponse est antérieure ou égale à l'heure du champ d'en-tête de requête `If-Modified-Since`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
