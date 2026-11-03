---
title: "http2_max_requests"
description: "Directive nginx http2_max_requests (ngx_http_v2_module) — NOTE Cette directive est obsolète depuis la version 1.19.7. Utiliser à la place la directive keepalive_requests. Définit le nombre maximal de requêtes (requêtes push comprises) pouvant être servies…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_max_requests number;` |
| **Valeur par défaut** | `http2_max_requests 1000;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.11.6 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> Cette directive est obsolète depuis la version 1.19.7. Utiliser à la place la directive [[12-directives/keepalive-requests-http-core|keepalive_requests]].

Définit le nombre maximal de requêtes (requêtes [[12-directives/http2-push|push]] comprises) pouvant être servies sur une connexion HTTP/2 ; la requête suivante du client provoque alors la fermeture de la connexion et l'établissement d'une nouvelle.

Fermer périodiquement les connexions est nécessaire pour libérer la mémoire allouée par connexion. Un nombre maximal de requêtes trop élevé peut donc entraîner une consommation de mémoire excessive et n'est pas recommandé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
