---
title: "LoadFile"
description: "Directive Apache LoadFile (mod_so) — Liaison du fichier objet ou de la bibliothèque spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_so]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Liaison du fichier objet ou de la bibliothèque spécifié |
| **Syntaxe** | `LoadFile nom-fichier [nom-fichier] ...` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_so\|mod_so]] |

## Utilisation

La directive `LoadFile` permet de lier le fichier objet ou la bibliothèque spécifié au serveur lors du démarrage ou du redémarrage de ce dernier ; ceci permet d'ajouter tout code additionnel nécessaire au fonctionnement d'un module. *nom-fichier* est soit un chemin absolu, soit un chemin relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

Par exemple :

```apache
LoadFile "libexec/libxmlparse.so"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
