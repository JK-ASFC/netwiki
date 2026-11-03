---
title: "directio"
description: "Directive nginx directio (ngx_http_core_module) — Enables the use of the O_DIRECT flag (FreeBSD, Linux), the F_NOCACHE flag (macOS), or the directio function (Solaris), when reading files that are larger than or equal to the specified size. The…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `directio size \| off;` |
| **Valeur par défaut** | `directio off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.7 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables the use of the `O_DIRECT` flag (FreeBSD, Linux), the `F_NOCACHE` flag (macOS), or the `directio` function (Solaris), when reading files that are larger than or equal to the specified *size*. The directive automatically disables (0.7.15) the use of [[12-directives/sendfile|sendfile]] for a given request. It can be useful for serving large files:

```nginx
directio 4m;
```

or when using [[12-directives/aio|aio]] on Linux.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
