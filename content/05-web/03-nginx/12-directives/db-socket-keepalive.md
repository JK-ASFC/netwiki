---
title: "db_socket_keepalive"
description: "Directive nginx db_socket_keepalive (ngx_http_db_module) — Configures the “TCP keepalive” behavior for outgoing connections to a database server. If enabled, the SO_KEEPALIVE socket option is turned on. This is distinct from caching idle upstream…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_socket_keepalive on \| off;` |
| **Valeur par défaut** | `db_socket_keepalive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Configures the “TCP keepalive” behavior for outgoing connections to a database server. If enabled, the `SO_KEEPALIVE` socket option is turned on.

This is distinct from caching idle upstream connections, which is configured using the [[12-directives/keepalive|keepalive]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
