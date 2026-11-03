---
title: "send_lowat"
description: "Directive nginx send_lowat (ngx_http_core_module) — If the directive is set to a non-zero value, nginx will try to minimize the number of send operations on client sockets by using either NOTE_LOWAT flag of the Connection processing methods method or…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `send_lowat size;` |
| **Valeur par défaut** | `send_lowat 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

If the directive is set to a non-zero value, nginx will try to minimize the number of send operations on client sockets by using either `NOTE_LOWAT` flag of the [[10-guides/01-introduction/events|Connection processing methods]] method or the `SO_SNDLOWAT` socket option. In both cases the specified *size* is used.

This directive is ignored on Linux, Solaris, and Windows.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
