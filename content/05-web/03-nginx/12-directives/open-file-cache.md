---
title: "open_file_cache"
description: "Directive nginx open_file_cache (ngx_http_core_module) — Configures a cache that can store: - open file descriptors, their sizes and modification times; - information on existence of directories; - file lookup errors, such as “file not found”, “no read…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_file_cache off;` ou `open_file_cache max=N [inactive=time];` |
| **Valeur par défaut** | `open_file_cache off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Configures a cache that can store:

- open file descriptors, their sizes and modification times;
- information on existence of directories;
- file lookup errors, such as “file not found”, “no read permission”, and so on.

  > [!NOTE]
  > Caching of errors should be enabled separately by the [[12-directives/open-file-cache-errors|open_file_cache_errors]] directive.

The directive has the following parameters:

- **`max`**

  sets the maximum number of elements in the cache; on cache overflow the least recently used (LRU) elements are removed;

- **`inactive`**

  defines a time after which an element is removed from the cache if it has not been accessed during this time; by default, it is 60 seconds;

- **`off`**

  disables the cache.

Example:

```nginx
open_file_cache          max=1000 inactive=20s;
open_file_cache_valid    30s;
open_file_cache_min_uses 2;
open_file_cache_errors   on;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
