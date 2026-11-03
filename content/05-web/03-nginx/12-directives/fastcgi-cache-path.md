---
title: "fastcgi_cache_path"
description: "Directive nginx fastcgi_cache_path (ngx_http_fastcgi_module) — Sets the path and other parameters of a cache. Cache data are stored in files. Both the key and file name in a cache are a result of applying the MD5 function to the proxied URL. The levels parameter…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_path path [levels=levels] [use_temp_path=on\|off] keys_zone=name:size [inactive=time] [max_size=size] [min_free=size] [manager_files=number] [manager_sleep=time] [manager_threshold=time] [loader_files=number] [loader_sleep=time] [loader_threshold=time] [purger=on\|off] [purger_files=number] [purger_sleep=time] [purger_threshold=time];` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Sets the path and other parameters of a cache. Cache data are stored in files. Both the key and file name in a cache are a result of applying the MD5 function to the proxied URL. The `levels` parameter defines hierarchy levels of a cache: from 1 to 3, each level accepts values 1 or 2. For example, in the following configuration

```nginx
fastcgi_cache_path /data/nginx/cache levels=1:2 keys_zone=one:10m;
```

les noms des fichiers du cache ressemblent à ceci :

```nginx
/data/nginx/cache/c/29/b7f54b2df7773722d382f4809d65029c
```

A cached response is first written to a temporary file, and then the file is renamed. Starting from version 0.8.9, temporary files and the cache can be put on different file systems. However, be aware that in this case a file is copied across two file systems instead of the cheap renaming operation. It is thus recommended that for any given location both cache and a directory holding temporary files are put on the same file system. A directory for temporary files is set based on the `use_temp_path` parameter (1.7.10). If this parameter is omitted or set to the value `on`, the directory set by the [[12-directives/fastcgi-temp-path|fastcgi_temp_path]] directive for the given location will be used. If the value is set to `off`, temporary files will be put directly in the cache directory.

En outre, toutes les clés actives et les informations sur les données sont conservées dans une zone de mémoire partagée dont le nom (*name*) et la taille (*size*) se règlent avec le paramètre `keys_zone`. Une zone d'un mégaoctet peut contenir environ 8 000 clés.

> [!NOTE]
> Dans le cadre de l'[abonnement commercial](https://nginx.com/products/), la zone de mémoire partagée contient aussi des [[11-modules/02-http/ngx_http_api_module|informations]] étendues sur le cache ; il faut donc prévoir une zone plus grande pour le même nombre de clés. Par exemple, une zone d'un mégaoctet peut contenir environ 4 000 clés.

Les données en cache non consultées pendant la durée indiquée par le paramètre `inactive` sont supprimées du cache, qu'elles soient fraîches ou non. Par défaut, `inactive` vaut 10 minutes.

Un processus spécial, le « gestionnaire de cache » (*cache manager*), surveille la taille maximale du cache définie par le paramètre `max_size` et l'espace libre minimal défini par le paramètre `min_free` (1.19.1) sur le système de fichiers du cache. Si la taille est dépassée ou que l'espace libre est insuffisant, il supprime les données les moins récemment utilisées. La suppression se fait par itérations réglées par les paramètres `manager_files`, `manager_threshold` et `manager_sleep` (1.11.5). Une itération supprime au plus `manager_files` éléments (100 par défaut) et sa durée est limitée par `manager_threshold` (200 millisecondes par défaut). Entre deux itérations, une pause définie par `manager_sleep` (50 millisecondes par défaut) est observée.

Une minute après le démarrage, un processus spécial, le « chargeur de cache » (*cache loader*), est activé. Il charge dans la zone de cache les informations sur les données mises en cache précédemment et stockées sur le système de fichiers. Le chargement se fait aussi par itérations : une itération charge au plus `loader_files` éléments (100 par défaut) et sa durée est limitée par le paramètre `loader_threshold` (200 millisecondes par défaut). Entre deux itérations, une pause définie par `loader_sleep` (50 millisecondes par défaut) est observée.

En outre, les paramètres suivants sont disponibles dans le cadre de notre [abonnement commercial](https://nginx.com/products/) :

- **`purger`=`on`|`off`**

  Instructs whether cache entries that match a [[12-directives/fastcgi-cache-purge|wildcard key]] will be removed from the disk by the cache purger (1.7.12). Setting the parameter to `on` (default is `off`) will activate the “cache purger” process that permanently iterates through all cache entries and deletes the entries that match the wildcard key.

- **`purger_files`=*number***

  Définit le nombre d'éléments examinés pendant une itération (1.7.12). Par défaut, `purger_files` vaut 10.

- **`purger_threshold`=*number***

  Définit la durée d'une itération (1.7.12). Par défaut, `purger_threshold` vaut 50 millisecondes.

- **`purger_sleep`=*number***

  Définit la pause entre deux itérations (1.7.12). Par défaut, `purger_sleep` vaut 50 millisecondes.

> [!NOTE]
> Dans les versions 1.7.3, 1.7.7 et 1.11.10, le format de l'en-tête du cache a changé. Les réponses mises en cache auparavant sont considérées comme non valides après la mise à niveau vers une version plus récente de nginx.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
