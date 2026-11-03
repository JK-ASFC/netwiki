---
title: "proxy_session_drop"
description: "Directive nginx proxy_session_drop (ngx_stream_proxy_module) — Active la fermeture de toutes les sessions vers un serveur mandaté après son retrait du groupe ou son marquage comme définitivement indisponible. Cela peut arriver suite à une nouvelle résolution ou…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_session_drop on \| off;` |
| **Valeur par défaut** | `proxy_session_drop off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Active la fermeture de toutes les sessions vers un serveur mandaté après son retrait du groupe ou son marquage comme définitivement indisponible. Cela peut arriver suite à une [[12-directives/resolver-stream-core|nouvelle résolution]] ou avec la commande [[11-modules/02-http/ngx_http_api_module|DELETE]] de l'API. Un serveur peut être marqué comme définitivement indisponible s'il est jugé [[12-directives/health-check-stream-upstream-hc|défaillant]] ou avec la commande [[11-modules/02-http/ngx_http_api_module|PATCH]] de l'API. Chaque session est fermée lors du traitement du prochain événement de lecture ou d'écriture pour le client ou le serveur mandaté.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
