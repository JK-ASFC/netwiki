---
title: "least_time (ngx_http_upstream_module)"
description: "Directive nginx least_time (ngx_http_upstream_module) — Indique que le groupe utilise une méthode de répartition qui transmet la requête au serveur ayant le temps de réponse moyen le plus court et le moins de connexions actives, en tenant compte des…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `least_time header \| last_byte [inflight];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.7.10 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Indique que le groupe utilise une méthode de répartition qui transmet la requête au serveur ayant le temps de réponse moyen le plus court et le moins de connexions actives, en tenant compte des poids. Si plusieurs serveurs sont à égalité, ils sont essayés à tour de rôle selon le tourniquet pondéré.

Avec le paramètre `header`, c'est la durée de réception de l'[[13-variables/upstream-header-time|en-tête de réponse]] qui est utilisée ; avec `last_byte`, la durée de réception de la [[13-variables/upstream-response-time|réponse complète]]. Avec le paramètre `inflight` (1.11.6), les requêtes non terminées sont aussi prises en compte.

> [!NOTE]
> Avant la version 1.11.6, les requêtes non terminées étaient prises en compte par défaut.

> [!NOTE]
> Avant la version 1.31.0, cette directive n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
