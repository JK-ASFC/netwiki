---
title: "CacheSocache"
description: "Directive Apache CacheSocache (mod_cache_socache) — Implémentation du cache d'objets partagés à utiliser. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Implémentation du cache d'objets partagés à utiliser |
| **Syntaxe** | `CacheSocache type[:args]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_socache\|mod_cache_socache]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

La directive `CacheSocache` définit l'implémentation du cache d'objets partagés à utiliser, suivie d'arguments optionnels. Il est possible de choisir entre plusieurs [[11-guides/01-generalites/le-cache-des-objets-partages-du-serveur-http-apache|implémentations]] de caches d'objets partagés.

```apache
CacheSocache shmcb
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
