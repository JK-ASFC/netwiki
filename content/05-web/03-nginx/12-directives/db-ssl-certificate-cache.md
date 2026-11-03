---
title: "db_ssl_certificate_cache"
description: "Directive nginx db_ssl_certificate_cache (ngx_http_db_module) — Defines a cache that stores SSL certificates and secret keys specified with variables. La directive accepte les paramètres suivants : - max définit le nombre maximal d'éléments dans le cache ; en cas…"
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
db_ssl_certificate_cache max=1000 inactive=20s valid=1m;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
