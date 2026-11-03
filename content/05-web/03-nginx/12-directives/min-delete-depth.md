---
title: "min_delete_depth"
description: "Directive nginx min_delete_depth (ngx_http_dav_module) — Allows the DELETE method to remove files provided that the number of elements in a request path is not less than the specified number. For example, the directive nginx min_delete_depth 4; allows…"
tags: [nginx, directive, ngx_http_dav_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `min_delete_depth number;` |
| **Valeur par défaut** | `min_delete_depth 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_dav_module\|ngx_http_dav_module]] |

## Utilisation

Allows the DELETE method to remove files provided that the number of elements in a request path is not less than the specified number. For example, the directive

```nginx
min_delete_depth 4;
```

allows removing files on requests

```nginx
/users/00/00/name
/users/00/00/name/pic.jpg
/users/00/00/page.html
```

and denies the removal of

```nginx
/users/00/00
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
