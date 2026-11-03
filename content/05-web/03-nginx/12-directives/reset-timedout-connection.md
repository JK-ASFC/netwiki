---
title: "reset_timedout_connection"
description: "Directive nginx reset_timedout_connection (ngx_http_core_module) — Active ou désactive la réinitialisation des connexions expirées et des connexions fermées avec le code non standard 444 (1.15.2). La réinitialisation se fait ainsi : avant de fermer le socket,…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `reset_timedout_connection on \| off;` |
| **Valeur par défaut** | `reset_timedout_connection off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive la réinitialisation des connexions expirées et des connexions [[12-directives/return-http-rewrite|fermées]] avec le code non standard 444 (1.15.2). La réinitialisation se fait ainsi : avant de fermer le socket, l'option `SO_LINGER` y est réglée avec un délai de 0. À la fermeture du socket, un TCP RST est envoyé au client et toute la mémoire occupée par le socket est libérée. Cela évite de garder longtemps un socket déjà fermé, aux tampons pleins, dans l'état FIN\_WAIT1.

Les connexions persistantes expirées sont, elles, fermées normalement.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
