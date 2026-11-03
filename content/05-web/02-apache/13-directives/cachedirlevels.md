---
title: "CacheDirLevels"
description: "Directive Apache CacheDirLevels (mod_cache_disk) — Le nombre de niveaux de sous-répertoires que comportera le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_disk]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nombre de niveaux de sous-répertoires que comportera le cache. |
| **Syntaxe** | `CacheDirLevels niveaux` |
| **Valeur par défaut** | `CacheDirLevels 2` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_disk\|mod_cache_disk]] |

## Utilisation

La directive `CacheDirLevels` permet de définir le nombre de niveaux de sous-répertoires que comportera le cache. Les données du cache seront stokées au niveau correspondant par rapport au répertoire [[13-directives/cacheroot|CacheRoot]].

Une valeur haute pour `CacheDirLevels` combinée avec une valeur basse pour `CacheDirLength` générera une arborescence très développée, avec un petit nombre de sous-répertoires à chaque niveau.

> [!NOTE]
> La valeur du produit `CacheDirLevels` \* [[13-directives/cachedirlength|CacheDirLength]] ne doit pas dépasser 20.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
