---
title: "debug_connection"
description: "Directive nginx debug_connection (Core functionality) — Enables debugging log for selected client connections. Other connections will use logging level set by the error_log directive. Debugged connections are specified by IPv4 or IPv6 (1.3.0, 1.2.1)…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `debug_connection address \| CIDR \| unix:;` |
| **Valeur par défaut** | — |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Enables debugging log for selected client connections. Other connections will use logging level set by the [[12-directives/error-log|error_log]] directive. Debugged connections are specified by IPv4 or IPv6 (1.3.0, 1.2.1) address or network. A connection may also be specified using a hostname. For connections using UNIX-domain sockets (1.3.0, 1.2.1), debugging log is enabled by the “`unix:`” parameter.

```nginx
events {
    debug_connection 127.0.0.1;
    debug_connection localhost;
    debug_connection 192.0.2.0/24;
    debug_connection ::1;
    debug_connection 2001:0db8::/32;
    debug_connection unix:;
    ...
}
```

> [!NOTE]
> For this directive to work, nginx needs to be built with `--with-debug`, see “[[10-guides/01-introduction/debugging-log|A debugging log]]”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
