---
title: "CacheDirLength"
description: "Directive Apache CacheDirLength (mod_cache_disk) — Le nombre de caractères des noms des sous-répertoires. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_disk]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nombre de caractères des noms des sous-répertoires |
| **Syntaxe** | `CacheDirLength longueur` |
| **Valeur par défaut** | `CacheDirLength 2` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_disk\|mod_cache_disk]] |

## Utilisation

la directive `CacheDirLength` permet de définir le nombre de caractères que comportera chaque nom de sous-répertoire de la hiérarchie du cache. On peut l'utiliser en conjonction avec `CacheDirLevels` pour déterminer une structure approximative de la hiérarchie de cache.

Une valeur haute pour `CacheDirLength` combinée avec une valeur basse pour `CacheDirLevels` générera une hiérarchie relativement peu profonde, avec un grand nombre de sous-répertoires à chaque niveau.

> [!NOTE]
> La valeur du produit `CacheDirLevels` \* [[13-directives/cachedirlength|CacheDirLength]] ne doit pas dépasser 20.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
