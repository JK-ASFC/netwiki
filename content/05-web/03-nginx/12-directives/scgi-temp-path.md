---
title: "scgi_temp_path"
description: "Directive nginx scgi_temp_path (ngx_http_scgi_module) — Defines a directory for storing temporary files with data received from SCGI servers. Up to three-level subdirectory hierarchy can be used underneath the specified directory. For example, in the…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_temp_path path [level1 [level2 [level3]]];` |
| **Valeur par défaut** | `scgi_temp_path scgi_temp;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Defines a directory for storing temporary files with data received from SCGI servers. Up to three-level subdirectory hierarchy can be used underneath the specified directory. For example, in the following configuration

```nginx
scgi_temp_path /spool/nginx/scgi_temp 1 2;
```

un fichier temporaire peut ressembler à ceci :

```nginx
/spool/nginx/scgi_temp/7/45/00000123457
```

See also the `use_temp_path` parameter of the [[12-directives/scgi-cache-path|scgi_cache_path]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
