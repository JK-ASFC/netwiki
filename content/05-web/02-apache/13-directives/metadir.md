---
title: "MetaDir"
description: "Directive Apache MetaDir (mod_cern_meta) — Le nom du répertoire où trouver les fichiers de métainformations dans le style du CERN. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cern_meta]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nom du répertoire où trouver les fichiers de métainformations dans le style du CERN |
| **Syntaxe** | `MetaDir répertoire` |
| **Valeur par défaut** | `MetaDir .web` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_cern_meta\|mod_cern_meta]] |

## Utilisation

Spécifie le nom du répertoire dans lequel Apache pourra trouver les fichiers de métainformations. Ce répertoire est en général un sous-répertoire 'caché' du répertoire qui contient le fichier à accéder. Définissez cette directive à "`.`" pour rechercher les métafichiers dans le même répertoire que le fichier à accéder :

```apache
MetaDir .
```

Ou, pour rechercher dans un sous-répertoire du répertoire contenant le fichier à accéder :

```apache
MetaDir .meta
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
