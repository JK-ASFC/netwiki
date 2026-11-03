---
title: "ssl_session_timeout (ngx_stream_ssl_module)"
description: "Directive nginx ssl_session_timeout (ngx_stream_ssl_module) — Specifies a time during which a client may reuse the session parameters. If the directive is specified on the server level, the value from the default server can be used. Details are provided in the…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_timeout time;` |
| **Valeur par défaut** | `ssl_session_timeout 5m;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Specifies a time during which a client may reuse the session parameters.

If the directive is specified on the [[12-directives/server-stream-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
