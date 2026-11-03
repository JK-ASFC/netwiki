---
title: "http2_max_requests"
description: "Directive nginx http2_max_requests (ngx_http_v2_module) — NOTE This directive is obsolete since version 1.19.7. The keepalive_requests directive should be used instead. Sets the maximum number of requests (including push requests) that can be served through…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_max_requests number;` |
| **Valeur par défaut** | `http2_max_requests 1000;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.11.6 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> This directive is obsolete since version 1.19.7. The [[12-directives/keepalive-requests-http-core|keepalive_requests]] directive should be used instead.

Sets the maximum number of requests (including [[12-directives/http2-push|push]] requests) that can be served through one HTTP/2 connection, after which the next client request will lead to connection closing and the need of establishing a new connection.

Fermer périodiquement les connexions est nécessaire pour libérer la mémoire allouée par connexion. Un nombre maximal de requêtes trop élevé peut donc entraîner une consommation de mémoire excessive et n'est pas recommandé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
