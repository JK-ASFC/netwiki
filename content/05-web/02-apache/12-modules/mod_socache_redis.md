---
title: "mod_socache_redis"
description: "Module Apache mod_socache_redis — Fournisseur de cache d'objets partagé basé sur Redis. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_socache_redis]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournisseur de cache d'objets partagé basé sur Redis. |
| **Statut** | Extension |
| **Identificateur** | `socache_redis_module` |
| **Fichier source** | `mod_socache_redis.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.39 du serveur HTTP Apache |

## Sommaire

[[12-modules/mod_socache_redis|mod_socache_redis]] implémente un fournisseur de cache d'objets partagé qui permet la création et l'accès à un cache hébergé par le système de mise en cache d'objets en mémoire partagée à hautes performances [Redis](https://redis.io/).

La méthode "create" de ce fournisseur de cache d'objets partagé nécessite une liste en mémoire de spécifications hôte/port séparées par des virgules. Si vous utilisez ce fournisseur dans une directive de configuration d'un autre module comme [[13-directives/sslsessioncache|SSLSessionCache]], spécifiez la liste des serveurs sous la forme du paramètre optionnel "arg" :

```apache
SSLSessionCache redis:redis.example.com:12345,redis2.example.com:12345
```

Vous trouverez une description détaillée des autres fournisseurs de cache d'objets partagé [[11-guides/01-generalites/le-cache-des-objets-partages-du-serveur-http-apache|ici]].

## Directives

- [[13-directives/redisconnpoolttl|RedisConnPoolTTL]]
- [[13-directives/redistimeout|RedisTimeout]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
