---
title: "proxy_responses"
description: "Directive nginx proxy_responses (ngx_stream_proxy_module) — Définit le nombre de datagrammes attendus du serveur mandaté en réponse à un datagramme client quand le protocole UDP est utilisé. Ce nombre sert d'indication pour terminer la session. Par défaut, il…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_responses number;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.13 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Définit le nombre de datagrammes attendus du serveur mandaté en réponse à un datagramme client quand le protocole [[11-modules/03-stream/ngx_stream_core_module|UDP]] est utilisé. Ce nombre sert d'indication pour terminer la session. Par défaut, il n'est pas limité.

Avec la valeur zéro, aucune réponse n'est attendue. Toutefois, si une réponse est reçue alors que la session n'est pas terminée, elle sera traitée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
