---
title: "CacheFile"
description: "Directive Apache CacheFile (mod_file_cache) — Met en cache une liste de gestionnaires de fichiers au démarrage. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_file_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Met en cache une liste de gestionnaires de fichiers au démarrage |
| **Syntaxe** | `CacheFile chemin fichier [chemin fichier] ...` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_file_cache\|mod_file_cache]] |

## Utilisation

La directive `CacheFile` permet d'associer des gestionnaires à un ou plusieurs fichiers (séparés par des espaces), et de placer ceux-ci dans le cache au démarrage du serveur. Les gestionnaires des fichiers mis en cache sont automatiquement fermés à l'arrêt du serveur. Lorsqu'un ou plusieurs fichiers ont été modifiés sur disque, le serveur doit être redémarré afin que les modifications soient prises en compte par le cache.

Soyez prudent avec les arguments *chemin fichier* : ils doivent correspondre exactement au chemin du système de fichier que créent les gestionnaires de traduction URL-vers-nom-fichier d'Apache. On ne peut pas comparer des inodes ou autres identifiants pour mettre en correspondance des chemins à l'aide de liens symboliques *(etc...)*, car là encore, ceci nécessiterait un appel à `stat()` supplémentaire, ce qui n'est pas acceptable. Il n'est pas garanti que ce module fonctionne avec des noms de fichiers réécrits par [[12-modules/mod_alias|mod_alias]] ou [[12-modules/mod_rewrite|mod_rewrite]].

**Exemple**

```apache
CacheFile /usr/local/apache/htdocs/index.html
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
