---
title: "mod_file_cache"
description: "Module Apache mod_file_cache — Mise en cache mémoire d'une liste statique de fichiers. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_file_cache]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Mise en cache mémoire d'une liste statique de fichiers |
| **Statut** | Expérimental |
| **Identificateur** | `file_cache_module` |
| **Fichier source** | `mod_file_cache.c` |

## Sommaire

> [!WARNING]
> Ce module doit être utilisé avec précautions. Il est recommandé de lire attentivement ce document, car l'utilisation de [[12-modules/mod_file_cache|mod_file_cache]] peut facilement conduire à la création d'un site inopérant.

La mise en cache de fichiers souvent demandés mais rarement modifiés est une technique permettant de réduire la charge du serveur. [[12-modules/mod_file_cache|mod_file_cache]] met en oeuvre deux techniques de mise en cache de fichiers *statiques* fréquemment demandés. Des directives de configuration vous permettent d'indiquer à [[12-modules/mod_file_cache|mod_file_cache]] soit d'ouvrir et de charger une image en mémoire d'un fichier avec `mmap()`, soit de préouvrir un fichier et de maintenir en service le *gestionnaire* du fichier. Les deux techniques permettent de réduire la charge du serveur lors du traitement des requêtes concernant ces fichiers, en accomplissant une partie du travail nécessaire à la mise à disposition de ces fichiers (en particulier les opérations d'entrées/sorties sur les fichiers) au démarrage du serveur, plutôt qu'au cours de chaque requête.

Note : ces techniques sont inutilisables pour accélérer des programmes CGI ou d'autres fichiers servis par des gestionnaires de contenu spéciaux. Elles ne peuvent être utilisées que pour des fichiers standards, normalement servis par le gestionnaire de contenu de base d'Apache.

Ce module est une extension du module d'Apache 1.3 `mod_mmap_static`et s'en inspire fortement .

## Utilisation de mod\_file\_cache

[[12-modules/mod_file_cache|mod_file_cache]] gère la mise en cache d'une liste de fichiers définie de manière statique via une des directives [[13-directives/mmapfile|MMapFile]] ou [[13-directives/cachefile|CacheFile]] au niveau de la configuration du serveur principal.

Les deux directives ne sont pas supportées par toutes les plates-formes. Par exemple, Apache pour Windows ne supporte pas actuellement la directive [[13-directives/mmapfile|MMapFile]], alors que d'autres plates-formes, comme AIX, supportent les deux. Vous recevrez un message d'erreur dans le journal des erreurs du serveur si vous essayez d'utiliser une directive non supportée. Si vous utilisez une directive non supportée, le serveur démarrera, mais les fichiers ne seront pas mis en cache. Sur les plates-formes qui supportent les deux directives, vous devez faire des essais afin de déterminer quelle directive vous convient le mieux.

### Directive MMapFile

La directive [[13-directives/mmapfile|MMapFile]] du module [[12-modules/mod_file_cache|mod_file_cache]] permet de transférer en mémoire une liste statique de fichiers à l'aide de l'appel système `mmap()`. Cet appel système est disponible sur la plupart des plates-formes de style Unix, mais pas sur toutes. Il existe parfois des limites spécifiques au système quant à la taille et au nombre de fichiers qui peuvent être `mmap()`és, et l'expérimentation est probablement la méthode la plus simple pour déterminer ces limites.

Ce `mmap()`age n'est effectué qu'une seul fois au démarrage ou redémarrage du serveur. Ainsi, chaque fois qu'un des fichiers chargés en mémoire est modifié au niveau du système de fichiers, vous *devez* redémarrer le serveur (voir la documentation sur l'[[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|Arrêt et redémarrage]]). Pour bien insister sur ce point, si des fichiers sont modifiés *sur disque*, et si vous ne redémarrez pas le serveur, vous allez finir par servir des contenus complètement obsolètes. Vous devez mettre à jour les fichiers en renommant l'ancienne version et en enregistrant la nouvelle sur disque. Pour y parvenir, on peut utiliser des outils comme `rdist` et `mv`. La raison pour laquelle ce module ne prend pas en compte les modifications de fichiers réside dans le fait que cette vérification nécessiterait un appel à `stat()` à chaque accès, et en fin de compte, l'augmentation de la consommation de ressources finirait par aller contre le but initial de réduire les entrées/sorties.

### Directive CacheFile

La directive [[13-directives/cachefile|CacheFile]] du module [[12-modules/mod_file_cache|mod_file_cache]] permet d'associer un *gestionnaire* ou *descripteur de fichier* à chaque fichier énuméré dans la directive de configuration et place ces gestionnaires de fichiers ouverts dans le cache. Lorsqu'un des fichier est demandé, le serveur sélectionne son gestionnaire dans le cache et le transmet à l'API `sendfile()` (ou `TransmitFile()` sous Windows).

Cette mise en cache des gestionnaire n'est effectuée qu'une seule fois au démarrage ou redémarrage du système. Ainsi, chaque fois qu'un des fichiers chargés en mémoire est modifié au niveau du système de fichiers, vous *devez* redémarrer le serveur (voir la documentation sur l'[[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|Arrêt et redémarrage]]). Pour bien insister sur ce point, si des fichiers sont modifiés *sur disque*, et si vous ne redémarrez pas le serveur, vous allez finir par servir des contenus complètement obsolètes. Vous devez mettre à jour les fichiers en renommant l'ancienne version et en enregistrant la nouvelle sur disque. Pour y parvenir, on peut utiliser des outils comme `rdist` et `mv`.

> [!NOTE]
> **Note**
>
> Ne cherchez pas à trouver de directive qui met tous les fichiers d'un répertoire en cache, de manière récursive. Pour y parvenir, vous pouvez vous reporter à la directive [[13-directives/include|Include]] directive, et considérer cette commande :
>
> ```
> find /www/htdocs -type f -print \
> | sed -e 's/.*/mmapfile &/' > /www/conf/mmap.conf
> ```

## Directives

- [[13-directives/mmapfile|MMapFile]]
- [[13-directives/cachefile|CacheFile]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
