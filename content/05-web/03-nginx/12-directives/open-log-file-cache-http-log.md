---
title: "open_log_file_cache (ngx_http_log_module)"
description: "Directive nginx open_log_file_cache (ngx_http_log_module) — Defines a cache that stores the file descriptors of frequently used logs whose names contain variables. The directive has the following parameters: - max sets the maximum number of descriptors in a…"
tags: [nginx, directive, ngx_http_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_log_file_cache max=N [inactive=time] [min_uses=N] [valid=time];` ou `open_log_file_cache off;` |
| **Valeur par défaut** | `open_log_file_cache off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_log_module\|ngx_http_log_module]] |

## Utilisation

Defines a cache that stores the file descriptors of frequently used logs whose names contain variables. The directive has the following parameters:

- **`max`**

  sets the maximum number of descriptors in a cache; if the cache becomes full the least recently used (LRU) descriptors are closed

- **`inactive`**

  sets the time after which the cached descriptor is closed if there were no access during this time; by default, 10 seconds

- **`min_uses`**

  sets the minimum number of file uses during the time defined by the `inactive` parameter to let the descriptor stay open in a cache; by default, 1

- **`valid`**

  sets the time after which it should be checked that the file still exists with the same name; by default, 60 seconds

- **`off`**

  disables caching

Usage example:

```nginx
open_log_file_cache max=1000 inactive=20s valid=1m min_uses=2;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
