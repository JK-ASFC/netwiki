---
title: "mod_cache_disk"
description: "Module Apache mod_cache_disk — Module de stockage sur disque pour le filtre de mise en cache HTTP. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_cache_disk]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module de stockage sur disque pour le filtre de mise en cache HTTP. |
| **Statut** | Extension |
| **Identificateur** | `cache_disk_module` |
| **Fichier source** | `mod_cache_disk.c` |

## Sommaire

[[12-modules/mod_cache_disk|mod_cache_disk]] implémente un gestionnaire de stockage sur disque pour le module [[12-modules/mod_cache|mod_cache]].

Les en-têtes et corps des réponses mises en cache sont stockés séparément sur le disque, dans une structure de répertoires basée sur le condensé md5 de l'URL mise en cache.

Plusieurs réponses au contenu négocié peuvent être stockées en même temps, mais la mise en cache de contenus partiels n'est pas supportée actuellement par ce module.

Les mises à jour atomiques du cache pour les fichiers d'en-tête et de corps peuvent être effectuées sans verrouillage en enregistrant les numéros d'inode et de périphérique du fichier de corps dans le fichier d'en-tête. Ceci implique que les entrées du cache déplacées manuellement dans le cache seront ignorées.

L'utilitaire [[10-commandes/htcacheclean|htcacheclean]] permet de lister et de supprimer les URLs du cache, ou de maintenir le cache en deçà de certaines limites de taille et/ou de nombre d'inodes. L'utilitaire peut être exécuté à la demande, ou automatiquement pour assurer un contrôle continu des tailles des répertoires.

> [!NOTE]
> **Note :**
>
> [[12-modules/mod_cache|mod_cache]] doit être chargé avant [[12-modules/mod_cache_disk|mod_cache_disk]] pour que ce dernier puisse fonctionner.

> [!NOTE]
> **Note :**
>
> Lorsque la plate-forme la supporte, et si elle est activée via la directive [[13-directives/enablesendfile|EnableSendfile]], [[12-modules/mod_cache_disk|mod_cache_disk]] utilise la fonctionnalité sendfile pour servir les fichiers à partir du cache. Cependant, [[12-modules/mod_cache_disk|mod_cache_disk]] ignore la configuration de la directive [[13-directives/enablesendfile|EnableSendfile]] dans un contexte de répertoire ou de fichier .htaccess, car le module ne dispose pas des définitions correspondantes lorsque la requête est servie depuis le cache.

## Directives

- [[13-directives/cacheroot|CacheRoot]]
- [[13-directives/cachedirlevels|CacheDirLevels]]
- [[13-directives/cachedirlength|CacheDirLength]]
- [[13-directives/cacheminfilesize|CacheMinFileSize]]
- [[13-directives/cachemaxfilesize|CacheMaxFileSize]]
- [[13-directives/cachereadsize|CacheReadSize]]
- [[13-directives/cachereadtime|CacheReadTime]]

## Voir aussi

- [[12-modules/mod_cache|mod_cache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
