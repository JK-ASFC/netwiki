---
title: "deny (ngx_stream_access_module)"
description: "Directive nginx deny (ngx_stream_access_module) — Denies access for the specified network or address. If the special value unix: is specified, denies access for all UNIX-domain sockets."
tags: [nginx, directive, ngx_stream_access_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `deny address \| CIDR \| unix: \| all;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_access_module\|ngx_stream_access_module]] |

## Utilisation

Denies access for the specified network or address. If the special value `unix:` is specified, denies access for all UNIX-domain sockets.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
