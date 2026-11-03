---
title: "dav_access"
description: "Directive nginx dav_access (ngx_http_dav_module) — Sets access permissions for newly created files and directories, e.g.: nginx dav_access user:rw group:rw all:r; If any group or all access permissions are specified then user permissions may be…"
tags: [nginx, directive, ngx_http_dav_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `dav_access users:permissions ...;` |
| **Valeur par défaut** | `dav_access user:rw;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_dav_module\|ngx_http_dav_module]] |

## Utilisation

Sets access permissions for newly created files and directories, e.g.:

```nginx
dav_access user:rw group:rw all:r;
```

If any `group` or `all` access permissions are specified then `user` permissions may be omitted:

```nginx
dav_access group:rw all:r;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
