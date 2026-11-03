---
title: "mp4_limit_rate_after"
description: "Directive nginx mp4_limit_rate_after (ngx_http_mp4_module) — Définit la quantité initiale de données multimédias (mesurée en durée de lecture) au-delà de laquelle la suite de la transmission de la réponse au client est limitée en débit. NOTE Cette directive…"
tags: [nginx, directive, ngx_http_mp4_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mp4_limit_rate_after time;` |
| **Valeur par défaut** | `mp4_limit_rate_after 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mp4_module\|ngx_http_mp4_module]] |

## Utilisation

Définit la quantité initiale de données multimédias (mesurée en durée de lecture) au-delà de laquelle la suite de la transmission de la réponse au client est limitée en débit.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
