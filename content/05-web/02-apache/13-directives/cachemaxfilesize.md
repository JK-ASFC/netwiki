---
title: "CacheMaxFileSize"
description: "Directive Apache CacheMaxFileSize (mod_cache_disk) — >La taille maximale (en octets) d'un document pour pouvoir être stocké dans le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_disk]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | \>La taille maximale (en octets) d'un document pour pouvoir être stocké dans le cache |
| **Syntaxe** | `CacheMaxFileSize octets` |
| **Valeur par défaut** | `CacheMaxFileSize 1000000` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_disk\|mod_cache_disk]] |

## Utilisation

La directive `CacheMaxFileSize` permet de définir la taille maximale d'un document, en octets, pour que celui-ci puisse faire l'objet d'un stockage dans le cache.

```apache
CacheMaxFileSize 64000
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
