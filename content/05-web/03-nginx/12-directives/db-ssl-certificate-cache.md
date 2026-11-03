---
title: "db_ssl_certificate_cache"
description: "Directive nginx db_ssl_certificate_cache (ngx_http_db_module) — Defines a cache that stores SSL certificates and secret keys specified with variables. The directive has the following parameters: - max sets the maximum number of elements in the cache; on cache…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_certificate_cache off;` ou `db_ssl_certificate_cache max=number [inactive=time] [valid=time];` |
| **Valeur par défaut** | `db_ssl_certificate_cache off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Defines a cache that stores [[12-directives/db-ssl-certificate|SSL certificates]] and [[12-directives/db-ssl-certificate-key|secret keys]] specified with variables.

The directive has the following parameters:

- **`max`**

  sets the maximum number of elements in the cache; on cache overflow the least recently used (LRU) elements are removed;

- **`inactive`**

  defines a time after which an element is removed from the cache if it has not been accessed during this time; by default, it is 10 seconds;

- **`valid`**

  defines a time during which an element in the cache is considered valid and can be reused; by default, it is 60 seconds. Certificates that exceed this time will be reloaded or revalidated;

- **`off`**

  disables the cache.

Example:

```nginx
db_ssl_certificate_cache max=1000 inactive=20s valid=1m;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
