---
title: "CacheRoot"
description: "Directive Apache CacheRoot (mod_cache_disk) — La racine du répertoire dans lequel les fichiers du cache seront stockés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_disk]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La racine du répertoire dans lequel les fichiers du cache seront stockés |
| **Syntaxe** | `CacheRoot répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_disk\|mod_cache_disk]] |

## Utilisation

La directive `CacheRoot` permet de définir le nom du répertoire sur disque qui contiendra les fichiers du cache. Si le module [[12-modules/mod_cache_disk|mod_cache_disk]] a été chargé ou compilé dans le serveur Apache, cette directive *doit* être définie. L'absence de définition de la directive `CacheRoot` provoquera une erreur de traitement du fichier de configuration. Les directives [[13-directives/cachedirlevels|CacheDirLevels]] et [[13-directives/cachedirlength|CacheDirLength]] permettent de définir la structure des sous-répertoires du répertoire racine spécifié.

```apache
CacheRoot c:/cacheroot
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
