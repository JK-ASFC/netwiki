---
title: "keepalive_requests (ngx_http_core_module)"
description: "Directive nginx keepalive_requests (ngx_http_core_module) — Définit le nombre maximal de requêtes pouvant être servies sur une connexion persistante. Une fois ce nombre atteint, la connexion est fermée. Fermer périodiquement les connexions est nécessaire pour…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_requests number;` |
| **Valeur par défaut** | `keepalive_requests 1000;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.0 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le nombre maximal de requêtes pouvant être servies sur une connexion persistante. Une fois ce nombre atteint, la connexion est fermée.

Fermer périodiquement les connexions est nécessaire pour libérer la mémoire allouée par connexion. Un nombre maximal de requêtes trop élevé peut donc entraîner une consommation de mémoire excessive et n'est pas recommandé.

> [!NOTE]
> Avant la version 1.19.10, la valeur par défaut était 100.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
