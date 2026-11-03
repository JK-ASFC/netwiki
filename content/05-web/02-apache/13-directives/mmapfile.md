---
title: "MMapFile"
description: "Directive Apache MMapFile (mod_file_cache) — Charge au démarrage une liste de fichiers en mémoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_file_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Charge au démarrage une liste de fichiers en mémoire |
| **Syntaxe** | `MMapFile chemin fichier [chemin fichier] ...` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_file_cache\|mod_file_cache]] |

## Utilisation

La directive `MMapFile` permet de charger un ou plusieurs fichiers (séparés par des espaces) en mémoire au démarrage du serveur. Ceux-ci sont automatiquement déchargés de la mémoire à l'arrêt du serveur. Lorsqu'un ou plusieurs fichiers ont été modifiés sur disque, on doit au minimum envoyer un signal `HUP` ou `USR1` au serveur afin de les re`mmap()`er.

Soyez prudent avec les arguments *chemin fichier* : ils doivent correspondre exactement au chemin du système de fichier que créent les gestionnaires de traduction URL-vers-nom-fichier d'Apache. On ne peut pas comparer des inodes ou autres identifiants pour mettre en correspondance des chemins à l'aide de liens symboliques *(etc...)*, car là encore, ceci nécessiterait un appel à `stat()` supplémentaire, ce qui n'est pas acceptable. Il n'est pas garanti que ce module fonctionne avec des noms de fichiers réécrits par [[12-modules/mod_alias|mod_alias]] ou [[12-modules/mod_rewrite|mod_rewrite]].

**Exemple**

```apache
MMapFile /usr/local/apache/htdocs/index.html
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
