---
title: "mod_cache_socache"
description: "Module Apache mod_cache_socache — Module de stockage à base de cache d'objets partagés (socache) pour le filtre de mise en cache HTTP. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_cache_socache]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module de stockage à base de cache d'objets partagés (socache) pour le filtre de mise en cache HTTP. |
| **Statut** | Extension |
| **Identificateur** | `cache_socache_module` |
| **Fichier source** | `mod_cache_socache.c` |

## Sommaire

Le module [[12-modules/mod_cache_socache|mod_cache_socache]] implémente un gestionnaire de stockage à base de cache d'objets partagés (socache) pour le module [[12-modules/mod_cache|mod_cache]].

Les en-têtes et corps des réponses mises en cache sont rassemblés et stockés sous une même clé dans le cache d'objets partagés. Il est possible de choisir entre plusieurs [[11-guides/01-generalites/le-cache-des-objets-partages-du-serveur-http-apache|implémentations]] de caches d'objets partagés.

Des réponses avec différents contenus négociés peuvent être stockées simultanément ; cependant, la mise en cache de contenus partiels n'est pas encore supportée par ce module.

```apache
# Activation de la mise en cache
CacheSocache shmcb
CacheSocacheMaxSize 102400
<Location "/foo">
    CacheEnable socache
</Location>

# Possibilité de se rabattre sur le cache disque
CacheSocache shmcb
CacheSocacheMaxSize 102400
<Location "/foo">
    CacheEnable socache
    CacheEnable disk
</Location>
```

> [!NOTE]
> **Note :**
>
> Le module [[12-modules/mod_cache_socache|mod_cache_socache]] requiert les services du module [[12-modules/mod_cache|mod_cache]] qui doit donc avoir été préalablement chargé.

## Directives

- [[13-directives/cachesocache|CacheSocache]]
- [[13-directives/cachesocachemaxtime|CacheSocacheMaxTime]]
- [[13-directives/cachesocachemintime|CacheSocacheMinTime]]
- [[13-directives/cachesocachemaxsize|CacheSocacheMaxSize]]
- [[13-directives/cachesocachereadsize|CacheSocacheReadSize]]
- [[13-directives/cachesocachereadtime|CacheSocacheReadTime]]

## Voir aussi

- [[12-modules/mod_cache|mod_cache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
