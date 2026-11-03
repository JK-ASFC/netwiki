---
title: "send_timeout"
description: "Directive nginx send_timeout (ngx_http_core_module) — Définit le délai de transmission d'une réponse au client. Ce délai porte uniquement sur l'intervalle entre deux écritures successives, pas sur la transmission de toute la réponse. Si le client ne…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `send_timeout time;` |
| **Valeur par défaut** | `send_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le délai de transmission d'une réponse au client. Ce délai porte uniquement sur l'intervalle entre deux écritures successives, pas sur la transmission de toute la réponse. Si le client ne reçoit rien pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
