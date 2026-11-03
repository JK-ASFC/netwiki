---
title: "session_sync_leeway"
description: "Directive nginx session_sync_leeway (ngx_http_oidc_module) — Définit le temps d'attente maximal pour qu'une session apparaisse dans la zone clé-valeur lorsqu'une requête contient un cookie de session mais que la session correspondante est introuvable. Cela…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_sync_leeway time;` |
| **Valeur par défaut** | `session_sync_leeway 0;` |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.31.6 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit le temps d'attente maximal pour qu'une session apparaisse dans la [[12-directives/session-store|zone clé-valeur]] lorsqu'une requête contient un cookie de session mais que la session correspondante est introuvable. Cela tient compte des délais de [[11-modules/03-stream/ngx_stream_zone_sync_module|synchronisation]] des sessions entre les nœuds d'un cluster.

La valeur doit être comprise entre `0` et `5s`. La valeur par défaut `0` désactive l'attente. Il est recommandé de choisir la plus petite valeur possible.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
