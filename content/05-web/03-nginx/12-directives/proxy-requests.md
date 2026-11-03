---
title: "proxy_requests"
description: "Directive nginx proxy_requests (ngx_stream_proxy_module) — Définit le nombre de datagrammes client au-delà duquel le lien entre un client et une session stream UDP existante est rompu. Après réception de ce nombre de datagrammes, le datagramme suivant du…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_requests number;` |
| **Valeur par défaut** | `proxy_requests 0;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.7 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Définit le nombre de datagrammes client au-delà duquel le lien entre un client et une session stream UDP existante est rompu. Après réception de ce nombre de datagrammes, le datagramme suivant du même client ouvre une nouvelle session. La session se termine quand tous les datagrammes du client ont été transmis au serveur mandaté et que le nombre attendu de [[12-directives/proxy-responses|réponses]] a été reçu, ou quand un [[12-directives/proxy-timeout-stream-proxy|délai]] expire.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
