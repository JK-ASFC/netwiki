---
title: "mod_socache_memcache"
description: "Module Apache mod_socache_memcache — Fournisseur de cache d'objets partagés basé sur Memcache. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_socache_memcache]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournisseur de cache d'objets partagés basé sur Memcache. |
| **Statut** | Extension |
| **Identificateur** | `socache_memcache_module` |
| **Fichier source** | `mod_socache_memcache.c` |

## Sommaire

Le module `mod_socache_memcache` est un fournisseur de cache d'objets partagés qui permet la création et l'accès à un cache maintenu par le système de mise en cache d'objets en mémoire distribuée à hautes performances [memcached](http://memcached.org/).

Cette méthode "create" du fournisseur de cache d'objets partagés requiert une liste de spécifications hôte/port en cache mémoire séparées par des virgules. Si vous utilisez ce fournisseur dans la configuration d'autres modules (comme [[13-directives/sslsessioncache|SSLSessionCache]]), vous devez fournir la liste des serveurs sous la forme du paramètre optionnel "arg".

```apache
SSLSessionCache memcache:memcache.example.com:12345,memcache2.example.com:12345
```

Vous trouverez des détails à propos des autres fournisseurs de cache d'objets partagés [[11-guides/01-generalites/le-cache-des-objets-partages-du-serveur-http-apache|ici]].

## Directives

- [[13-directives/memcacheconnttl|MemcacheConnTTL]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
