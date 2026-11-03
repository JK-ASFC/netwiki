---
title: "server_tokens"
description: "Directive nginx server_tokens (ngx_http_core_module) — Active ou désactive l'affichage de la version de nginx dans les pages d'erreur et dans le champ d'en-tête de réponse Server. Le paramètre build (1.11.10) ajoute le nom de compilation à la version de…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_tokens on \| off \| build \| string;` |
| **Valeur par défaut** | `server_tokens on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'affichage de la version de nginx dans les pages d'erreur et dans le champ d'en-tête de réponse `Server`.

Le paramètre `build` (1.11.10) ajoute le [[10-guides/01-introduction/configure|nom de compilation]] à la version de nginx.

En outre, dans le cadre de notre [abonnement commercial](https://nginx.com/products/), depuis la version 1.9.13, la signature des pages d'erreur et la valeur du champ d'en-tête de réponse `Server` peuvent être définies explicitement par une chaîne (*string*) avec variables. Une chaîne vide supprime le champ `Server`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
