---
title: "reset_timedout_connection"
description: "Directive nginx reset_timedout_connection (ngx_http_core_module) — Enables or disables resetting timed out connections and connections closed with the non-standard code 444 (1.15.2). The reset is performed as follows. Before closing a socket, the SO_LINGER option is…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `reset_timedout_connection on \| off;` |
| **Valeur par défaut** | `reset_timedout_connection off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables resetting timed out connections and connections [[12-directives/return-http-rewrite|closed]] with the non-standard code 444 (1.15.2). The reset is performed as follows. Before closing a socket, the `SO_LINGER` option is set on it with a timeout value of 0. When the socket is closed, TCP RST is sent to the client, and all memory occupied by this socket is released. This helps avoid keeping an already closed socket with filled buffers in a FIN\_WAIT1 state for a long time.

It should be noted that timed out keep-alive connections are closed normally.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
