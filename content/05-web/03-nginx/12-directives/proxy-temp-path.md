---
title: "proxy_temp_path"
description: "Directive nginx proxy_temp_path (ngx_http_proxy_module) — Defines a directory for storing temporary files with data received from proxied servers. Up to three-level subdirectory hierarchy can be used underneath the specified directory. For example, in the…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_temp_path path [level1 [level2 [level3]]];` |
| **Valeur par défaut** | `proxy_temp_path proxy_temp;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Defines a directory for storing temporary files with data received from proxied servers. Up to three-level subdirectory hierarchy can be used underneath the specified directory. For example, in the following configuration

```nginx
proxy_temp_path /spool/nginx/proxy_temp 1 2;
```

a temporary file might look like this:

```nginx
/spool/nginx/proxy_temp/7/45/00000123457
```

See also the `use_temp_path` parameter of the [[12-directives/proxy-cache-path|proxy_cache_path]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
