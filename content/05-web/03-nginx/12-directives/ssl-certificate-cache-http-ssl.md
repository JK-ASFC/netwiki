---
title: "ssl_certificate_cache (ngx_http_ssl_module)"
description: "Directive nginx ssl_certificate_cache (ngx_http_ssl_module) — Définit un cache qui conserve les certificats SSL et les clés secrètes indiqués par des variables. La directive accepte les paramètres suivants : - max définit le nombre maximal d'éléments dans le…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate_cache off;` ou `ssl_certificate_cache max=N [inactive=time] [valid=time];` |
| **Valeur par défaut** | `ssl_certificate_cache off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Définit un cache qui conserve les [[12-directives/ssl-certificate-http-ssl|certificats SSL]] et les [[12-directives/ssl-certificate-key-http-ssl|clés secrètes]] indiqués par des variables.

La directive accepte les paramètres suivants :

- **`max`**

  définit le nombre maximal d'éléments dans le cache ; en cas de débordement, les éléments les moins récemment utilisés (LRU) sont supprimés ;

- **`inactive`**

  définit la durée au bout de laquelle un élément est supprimé du cache s'il n'a pas été utilisé ; 10 secondes par défaut ;

- **`valid`**

  définit la durée pendant laquelle un élément du cache est considéré comme valide et réutilisable ; 60 secondes par défaut. Les certificats qui dépassent cette durée sont rechargés ou revalidés ;

- **`off`**

  désactive le cache.

Exemple :

```nginx
ssl_certificate_cache max=1000 inactive=20s valid=1m;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
