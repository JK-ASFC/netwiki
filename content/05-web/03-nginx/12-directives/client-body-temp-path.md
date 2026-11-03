---
title: "client_body_temp_path"
description: "Directive nginx client_body_temp_path (ngx_http_core_module) — Defines a directory for storing temporary files holding client request bodies. Up to three-level subdirectory hierarchy can be used under the specified directory. For example, in the following…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_temp_path path [level1 [level2 [level3]]];` |
| **Valeur par défaut** | `client_body_temp_path client_body_temp;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Defines a directory for storing temporary files holding client request bodies. Up to three-level subdirectory hierarchy can be used under the specified directory. For example, in the following configuration

```nginx
client_body_temp_path /spool/nginx/client_temp 1 2;
```

a path to a temporary file might look like this:

```nginx
/spool/nginx/client_temp/7/45/00000123457
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
