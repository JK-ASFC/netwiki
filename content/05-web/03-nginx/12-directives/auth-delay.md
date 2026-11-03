---
title: "auth_delay"
description: "Directive nginx auth_delay (ngx_http_core_module) — Retarde le traitement des requêtes non autorisées (code de réponse 401) pour empêcher les attaques temporelles lorsque l'accès est limité par mot de passe, par le résultat d'une sous-requête ou par…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_delay time;` |
| **Valeur par défaut** | `auth_delay 0s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.17.10 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Retarde le traitement des requêtes non autorisées (code de réponse 401) pour empêcher les attaques temporelles lorsque l'accès est limité par [[11-modules/02-http/ngx_http_auth_basic_module|mot de passe]], par le [[11-modules/02-http/ngx_http_auth_request_module|résultat d'une sous-requête]] ou par [[11-modules/02-http/ngx_http_auth_jwt_module|JWT]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
