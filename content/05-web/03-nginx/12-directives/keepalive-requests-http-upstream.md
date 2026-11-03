---
title: "keepalive_requests (ngx_http_upstream_module)"
description: "Directive nginx keepalive_requests (ngx_http_upstream_module) — Sets the maximum number of requests that can be served through one keepalive connection. After the maximum number of requests is made, the connection is closed. Fermer périodiquement les connexions…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_requests number;` |
| **Valeur par défaut** | `keepalive_requests 1000;` |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.15.3 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Sets the maximum number of requests that can be served through one keepalive connection. After the maximum number of requests is made, the connection is closed.

Fermer périodiquement les connexions est nécessaire pour libérer la mémoire allouée par connexion. Un nombre maximal de requêtes trop élevé peut donc entraîner une consommation de mémoire excessive et n'est pas recommandé.

> [!NOTE]
> Avant la version 1.19.10, la valeur par défaut était 100.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
