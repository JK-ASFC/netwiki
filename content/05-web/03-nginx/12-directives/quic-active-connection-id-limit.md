---
title: "quic_active_connection_id_limit"
description: "Directive nginx quic_active_connection_id_limit (ngx_http_v3_module) — Définit la valeur du paramètre de transport QUIC active_connection_id_limit, soit le nombre maximal d'identifiants de connexion du client que le serveur peut conserver."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_active_connection_id_limit number;` |
| **Valeur par défaut** | `quic_active_connection_id_limit 2;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Définit la valeur du paramètre de transport QUIC `active_connection_id_limit`, soit le nombre maximal d'identifiants de connexion du client que le serveur peut conserver.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
