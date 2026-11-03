---
title: "TypesConfig"
description: "Directive Apache TypesConfig (mod_mime) — Le chemin du fichier mime.types. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le chemin du fichier `mime.types` |
| **Syntaxe** | `TypesConfig chemin-fichier` |
| **Valeur par défaut** | `TypesConfig conf/mime.types` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `TypesConfig` permet de définir le chemin du fichier de configuration des types de média. L'argument *chemin-fichier* est un chemin relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]]. Ce fichier contient la liste des associations par défaut des extensions de noms de fichiers aux types de contenus. La plupart des administrateurs utilisent le fichier `mime.types` fourni par leur OS, qui associe les extensions de noms de fichiers courantes à la liste officielle des types de média enregistrés par l'IANA et maintenue à [http://www.iana.org/assignments/media-types/index.html](http://www.iana.org/assignments/media-types/index.html), ainsi qu'un grand nombre de types non officiels. Ce fichier permet de simplifier le fichier `httpd.conf` en fournissant la majorité des définitions de types de média, et ses définitions peuvent être écrasées par des directives [[13-directives/addtype|AddType]], selon les besoins. Il est déconseillé de modifier le contenu du fichier `mime.types` car il peut être remplacé lors d'une mise à jour du serveur.

Le fichier contient des lignes dont le format est identique à celui des arguments d'une directive [[13-directives/addtype|AddType]] :

```
type-médium [extension] ...
```

Les extensions sont insensibles à la casse. Les lignes vides et les lignes commençant par un dièse (`#`) sont ignorées. Les lignes vides servent à compléter le fichier mime.types. Apache httpd peut encore déterminer ces types via le module [[12-modules/mod_mime_magic|mod_mime_magic]].

> [!NOTE]
> Merci de **ne pas** soumettre de requêtes au Projet de Serveur HTTP Apache pour ajouter une entrée dans le fichier `mime.types` fourni, sauf si : 1) le type de médium est déjà enregistré à l'IANA 2) et si l'extension est largement acceptée et ne provoque pas de conflits d'extensions entre les différentes plate-formes. Les requêtes du type `catégorie/x-sous-type` seront systématiquement rejetées, ainsi que toute nouvelle extension de deux lettres, car elle ont de fortes chances d'entrer en conflit par la suite avec les innombrables langages préexistants et les espaces de nommage des jeux de caractères.

## Voir aussi

- [[12-modules/mod_mime_magic|mod_mime_magic]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
