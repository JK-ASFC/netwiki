---
title: "lingering_close"
description: "Directive nginx lingering_close (ngx_http_core_module) — Controls how nginx closes client connections. The default value “on” instructs nginx to wait for and process additional data from a client before fully closing a connection, but only if heuristics…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `lingering_close off \| on \| always;` |
| **Valeur par défaut** | `lingering_close on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.0, 1.0.6 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Controls how nginx closes client connections.

The default value “`on`” instructs nginx to [[12-directives/lingering-timeout|wait for]] and [[12-directives/lingering-time|process]] additional data from a client before fully closing a connection, but only if heuristics suggests that a client may be sending more data.

The value “`always`” will cause nginx to unconditionally wait for and process additional client data.

The value “`off`” tells nginx to never wait for more data and close the connection immediately. This behavior breaks the protocol and should not be used under normal circumstances.

To control closing [[11-modules/02-http/ngx_http_v2_module|HTTP/2]] connections, the directive must be specified on the [[12-directives/server-http-core|server]] level (1.19.1).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
