---
title: "LoadModule"
description: "Directive Apache LoadModule (mod_so) — Liaison avec le serveur du fichier objet ou de la bibliothèque spécifié, et ajout de ce dernier à la liste des modules actifs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_so]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Liaison avec le serveur du fichier objet ou de la bibliothèque spécifié, et ajout de ce dernier à la liste des modules actifs |
| **Syntaxe** | `LoadModule module nom-fichier` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_so\|mod_so]] |

## Utilisation

La directive `LoadModule` permet de lier le fichier objet ou la bibliothèque *nom-fichier* avec le serveur, et d'ajouter la structure de module nommée *module* à la liste des modules actifs. *module* est le nom de la variable externe de type `module` dans le fichier, et est référencé comme Identificateur de module dans la documentation des modules.

Par exemple :

```apache
LoadModule status_module "modules/mod_status.so"
```

charge le module spécifié depuis le sous-répertoire des modules situé à la racine du serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
