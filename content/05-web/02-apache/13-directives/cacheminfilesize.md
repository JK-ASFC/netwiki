---
title: "CacheMinFileSize"
description: "Directive Apache CacheMinFileSize (mod_cache_disk) — La taille minimale (en octets) d'un document pour pouvoir être stocké dans le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_disk]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La taille minimale (en octets) d'un document pour pouvoir être stocké dans le cache |
| **Syntaxe** | `CacheMinFileSize octets` |
| **Valeur par défaut** | `CacheMinFileSize 1` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_disk\|mod_cache_disk]] |

## Utilisation

La directive `CacheMinFileSize` permet de définir la taille minimale d'un document, en octets, pour que celui-ci puisse faire l'objet d'un stockage dans le cache.

```apache
CacheMinFileSize 64
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
