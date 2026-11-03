---
title: "quic_active_connection_id_limit"
description: "Directive nginx quic_active_connection_id_limit (ngx_http_v3_module) — Sets the QUIC active_connection_id_limit transport parameter value. This is the maximum number of client connection IDs which can be stored on the server."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_active_connection_id_limit number;` |
| **Valeur par défaut** | `quic_active_connection_id_limit 2;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Sets the QUIC `active_connection_id_limit` transport parameter value. This is the maximum number of client connection IDs which can be stored on the server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
