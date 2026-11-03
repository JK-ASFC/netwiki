---
title: "proxy_ssl_certificate_cache (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_certificate_cache (ngx_stream_proxy_module) — Defines a cache that stores SSL certificates and secret keys specified with variables. La directive accepte les paramètres suivants : - max définit le nombre maximal d'éléments dans le cache ; en cas…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_certificate_cache off;` ou `proxy_ssl_certificate_cache max=N [inactive=time] [valid=time];` |
| **Valeur par défaut** | `proxy_ssl_certificate_cache off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Defines a cache that stores [[12-directives/proxy-ssl-certificate-stream-proxy|SSL certificates]] and [[12-directives/proxy-ssl-certificate-key-stream-proxy|secret keys]] specified with variables.

La directive accepte les paramètres suivants :

- **`max`**

  définit le nombre maximal d'éléments dans le cache ; en cas de débordement, les éléments les moins récemment utilisés (LRU) sont supprimés ;

- **`inactive`**

  defines a time after which an element is removed from the cache if it has not been accessed during this time; by default, it is 10 seconds;

- **`valid`**

  defines a time during which an element in the cache is considered valid and can be reused; by default, it is 60 seconds. Certificates that exceed this time will be reloaded or revalidated;

- **`off`**

  désactive le cache.

Exemple :

```nginx
proxy_ssl_certificate       $proxy_ssl_server_name.crt;
proxy_ssl_certificate_key   $proxy_ssl_server_name.key;
proxy_ssl_certificate_cache max=1000 inactive=20s valid=1m;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
