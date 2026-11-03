---
title: "random (ngx_http_upstream_module)"
description: "Directive nginx random (ngx_http_upstream_module) — Indique que le groupe utilise une méthode de répartition qui transmet la requête à un serveur choisi au hasard, en tenant compte des poids. Le paramètre facultatif two demande à nginx de choisir au…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `random [two [method]];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.15.1 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Indique que le groupe utilise une méthode de répartition qui transmet la requête à un serveur choisi au hasard, en tenant compte des poids.

Le paramètre facultatif `two` demande à nginx de choisir au hasard [deux](https://homes.cs.washington.edu/~karlin/papers/balls.pdf) serveurs, puis d'en retenir un selon la méthode (`method`) indiquée. La méthode par défaut est `least_conn`, qui transmet la requête au serveur ayant le moins de connexions actives.

La méthode `least_time` transmet la requête au serveur ayant le temps de réponse moyen le plus court et le moins de connexions actives. Avec `least_time=header`, c'est la durée de réception de l'[[13-variables/upstream-header-time|en-tête de réponse]] qui est utilisée ; avec `least_time=last_byte`, celle de la [[13-variables/upstream-response-time|réponse complète]].

> [!NOTE]
> La méthode `least_time` est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
