---
title: "uwsgi_cache_path"
description: "Directive nginx uwsgi_cache_path (ngx_http_uwsgi_module) — Définit le chemin et les autres paramètres d'un cache. Les données du cache sont stockées dans des fichiers. Le nom d'un fichier du cache est le résultat de la fonction MD5 appliquée à la clé de…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_path path [levels=levels] [use_temp_path=on\|off] keys_zone=name:size [inactive=time] [max_size=size] [min_free=size] [manager_files=number] [manager_sleep=time] [manager_threshold=time] [loader_files=number] [loader_sleep=time] [loader_threshold=time] [purger=on\|off] [purger_files=number] [purger_sleep=time] [purger_threshold=time];` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit le chemin et les autres paramètres d'un cache. Les données du cache sont stockées dans des fichiers. Le nom d'un fichier du cache est le résultat de la fonction MD5 appliquée à la [[12-directives/uwsgi-cache-key|clé de cache]]. Le paramètre `levels` définit les niveaux de hiérarchie du cache : de 1 à 3, chaque niveau acceptant les valeurs 1 ou 2. Par exemple, avec la configuration suivante

```nginx
uwsgi_cache_path /data/nginx/cache levels=1:2 keys_zone=one:10m;
```

les noms des fichiers du cache ressemblent à ceci :

```nginx
/data/nginx/cache/c/29/b7f54b2df7773722d382f4809d65029c
```

Une réponse mise en cache est d'abord écrite dans un fichier temporaire, puis le fichier est renommé. Depuis la version 0.8.9, les fichiers temporaires et le cache peuvent se trouver sur des systèmes de fichiers différents ; mais le fichier est alors copié d'un système de fichiers à l'autre au lieu d'un simple renommage, peu coûteux. Il est donc recommandé, pour un bloc location donné, de placer le cache et le répertoire des fichiers temporaires sur le même système de fichiers. Le répertoire des fichiers temporaires dépend du paramètre `use_temp_path` (1.7.10) : s'il est omis ou vaut `on`, le répertoire défini par la directive [[12-directives/uwsgi-temp-path|uwsgi_temp_path]] pour ce bloc location est utilisé ; s'il vaut `off`, les fichiers temporaires sont placés directement dans le répertoire du cache.

En outre, toutes les clés actives et les informations sur les données sont conservées dans une zone de mémoire partagée dont le nom (*name*) et la taille (*size*) se règlent avec le paramètre `keys_zone`. Une zone d'un mégaoctet peut contenir environ 8 000 clés.

> [!NOTE]
> Dans le cadre de l'[abonnement commercial](https://nginx.com/products/), la zone de mémoire partagée contient aussi des [[11-modules/02-http/ngx_http_api_module|informations]] étendues sur le cache ; il faut donc prévoir une zone plus grande pour le même nombre de clés. Par exemple, une zone d'un mégaoctet peut contenir environ 4 000 clés.

Les données en cache non consultées pendant la durée indiquée par le paramètre `inactive` sont supprimées du cache, qu'elles soient fraîches ou non. Par défaut, `inactive` vaut 10 minutes.

Un processus spécial, le « gestionnaire de cache » (*cache manager*), surveille la taille maximale du cache définie par le paramètre `max_size` et l'espace libre minimal défini par le paramètre `min_free` (1.19.1) sur le système de fichiers du cache. Si la taille est dépassée ou que l'espace libre est insuffisant, il supprime les données les moins récemment utilisées. La suppression se fait par itérations réglées par les paramètres `manager_files`, `manager_threshold` et `manager_sleep` (1.11.5). Une itération supprime au plus `manager_files` éléments (100 par défaut) et sa durée est limitée par `manager_threshold` (200 millisecondes par défaut). Entre deux itérations, une pause définie par `manager_sleep` (50 millisecondes par défaut) est observée.

Une minute après le démarrage, un processus spécial, le « chargeur de cache » (*cache loader*), est activé. Il charge dans la zone de cache les informations sur les données mises en cache précédemment et stockées sur le système de fichiers. Le chargement se fait aussi par itérations : une itération charge au plus `loader_files` éléments (100 par défaut) et sa durée est limitée par le paramètre `loader_threshold` (200 millisecondes par défaut). Entre deux itérations, une pause définie par `loader_sleep` (50 millisecondes par défaut) est observée.

En outre, les paramètres suivants sont disponibles dans le cadre de notre [abonnement commercial](https://nginx.com/products/) :

- **`purger`=`on`|`off`**

  Indique si les entrées du cache correspondant à une [[12-directives/uwsgi-cache-purge|clé générique]] sont supprimées du disque par le purgeur de cache (1.7.12). Avec la valeur `on` (par défaut `off`), le processus « purgeur de cache » parcourt en permanence toutes les entrées du cache et supprime celles qui correspondent à la clé générique.

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
