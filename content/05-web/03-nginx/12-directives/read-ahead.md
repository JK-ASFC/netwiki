---
title: "read_ahead"
description: "Directive nginx read_ahead (ngx_http_core_module) — Sets the amount of pre-reading for the kernel when working with file. On Linux, the posix_fadvise(0, 0, 0, POSIX_FADV_SEQUENTIAL) system call is used, and so the size parameter is ignored. On…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `read_ahead size;` |
| **Valeur par défaut** | `read_ahead 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the amount of pre-reading for the kernel when working with file.

On Linux, the `posix_fadvise(0, 0, 0, POSIX_FADV_SEQUENTIAL)` system call is used, and so the *size* parameter is ignored.

On FreeBSD, the `fcntl(O_READAHEAD,` *size*`)` system call, supported since FreeBSD 9.0-CURRENT, is used. FreeBSD 7 has to be [patched](http://sysoev.ru/freebsd/patch.readahead.txt).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
