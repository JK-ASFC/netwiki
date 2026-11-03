---
title: "ssl_session_tickets (ngx_stream_ssl_module)"
description: "Directive nginx ssl_session_tickets (ngx_stream_ssl_module) — Active ou désactive la reprise de session par tickets de session TLS. If the directive is specified on the server level, the value from the default server can be used. Details are provided in the…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_tickets on \| off;` |
| **Valeur par défaut** | `ssl_session_tickets on;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Active ou désactive la reprise de session par [tickets de session TLS](https://datatracker.ietf.org/doc/html/rfc5077).

If the directive is specified on the [[12-directives/server-stream-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
