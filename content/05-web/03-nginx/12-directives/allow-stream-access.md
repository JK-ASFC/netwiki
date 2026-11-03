---
title: "allow (ngx_stream_access_module)"
description: "Directive nginx allow (ngx_stream_access_module) — Allows access for the specified network or address. If the special value unix: is specified, allows access for all UNIX-domain sockets."
tags: [nginx, directive, ngx_stream_access_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `allow address \| CIDR \| unix: \| all;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_access_module\|ngx_stream_access_module]] |

## Utilisation

Allows access for the specified network or address. If the special value `unix:` is specified, allows access for all UNIX-domain sockets.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
