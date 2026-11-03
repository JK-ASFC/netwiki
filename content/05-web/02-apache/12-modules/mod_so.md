---
title: "mod_so"
description: "Module Apache mod_so — Chargement de modules ou de code exécutable au cours du démarrage ou du redémarrage du serveur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_so]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chargement de modules ou de code exécutable au cours du démarrage ou du redémarrage du serveur |
| **Statut** | Extension |
| **Identificateur** | `so_module` |
| **Fichier source** | `mod_so.c` |
| **Compatibilité** | Sous Windows, c'est un module de base (toujours inclus) |

## Sommaire

Sur les systèmes d'exploitation sélectionnés, ce module peut être utilisé pour charger des modules dans le serveur HTTP Apache en cours d'exécution grâce au mécanisme des [[11-guides/01-generalites/prise-en-charge-des-objets-dynamiques-partages-dso|Dynamic Shared Object ou Objets Partagés Dynamiquement]] (DSO), et évite ainsi de devoir effectuer une recompilation.

Sous Unix, le code chargé provient en général de fichiers objet partagés possèdant en général l'extension `.so`, alors que sous Windows, l'extension peut être soit `.so`, soit `.dll`.

> [!WARNING]
> **Avertissement**
>
> En général, les modules compilés pour une version majeure du serveur HTTP Apache ne fonctionneront pas avec une autre (par exemple de 1.3 à 2.0 ou 2.0 à 2.2). D'une version majeure à l'autre, il y a souvent des modifications d'API qui nécessitent des modifications du module pour qu'il puisse fonctionner avec la nouvelle version.

## Création de modules chargeables pour Windows

> [!NOTE]
> **Note**
>
> Sous Windows, où les modules chargeables possèdent en général l'extension de nom de fichier `.dll`, les modules Apache httpd se nomment `mod_nom-module.so`, tout comme sur les autres plates-formes. Vous trouverez cependant encore des modules tiers, comme PHP par exemple, qui continuent d'utiliser la convention de nommage avec extension `.dll`.
>
> Bien que `mod_so` puisse encore charger des modules possèdant un nom du style `ApacheModuleFoo.dll`, il est préférable d'utiliser la nouvelle convention de nommage ; si vous modifiez votre module chargeable pour la version 2.0, veuillez aussi modifier son nom pour respecter cette nouvelle convention.

Les API des modules Apache httpd sous Unix et Windows sont identiques. Alors que certains modules s'appuient sur certains aspects de l'architecture Unix non présents dans Windows, et ne fonctionneront donc pas sur cette dernière plate-forme, de nombreux modules fonctionnent sous Windows avec peu ou pas de modification par rapport à leur version Unix.

Lorsqu'un module fonctionne, il peut être ajouté au serveur de deux manières. Sous Unix, il peut être compilé dans le serveur. Comme Apache httpd pour Windows ne dispose pas du programme `Configure` propre à Apache httpd pour Unix, le fichier source du module doit être ajouté au fichier projet Apache de base, et ses symboles ajoutés au fichier `os\win32\modules.c`.

La seconde méthode consiste à compiler le module en tant que DLL, à savoir une bibliothèque partagée qui pourra être chargée dans le serveur en cours d'exécution via la directive `LoadModule`. Ces modules DLL peuvent être distribués et exécutés sur toute installation d'Apache httpd pour Windows, sans avoir à recompiler le serveur.

Pour créer un module DLL, il est nécessaire d'apporter une légère modification à son fichier source : l'enregistrement du module doit être exporté depuis la DLL (qui sera elle-même créée plus tard ; voir plus loin). Pour ce faire, ajoutez la macro `AP_MODULE_DECLARE_DATA` (définie dans les fichiers d'en-têtes d'Apache httpd) à la définition de l'enregistrement de votre module. Par exemple, si votre module est déclaré comme suit :

```
module foo_module;
```

Remplacez cette ligne par :

```
module AP_MODULE_DECLARE_DATA foo_module;
```

Notez que cette macro ne sera prise en compte que sous Windows, si bien que le module poura être utilisé sans changement sous Unix, si besoin est. Alternativement, si vous êtes familier avec les fichiers `.DEF`, vous pouvez les utiliser pour exporter l'enregistrement du module.

Maintenant, nous sommes prêts à créer une DLL contenant notre module. Il va falloir pour cela la lier avec la bibliothèque d'export libhttpd.lib qui a été créée au cours de la compilation de la bibliothèque partagée libhttpd.dll. Il sera peut-être aussi nécessaire de modifier la configuration du compilateur pour s'assurer que les fichiers d'en-têtes d'Apache httpd seront correctement localisés. Vous trouverez cette bibliothèque à la racine du répertoire des modules de votre serveur. Il est souhaitable d'utiliser un fichier de module .dsp existant dans l'arborescence afin de s'assurer que l'environnement de compilation est correctement configuré, mais vous pouvez aussi comparer les options de compilation et d'édition de liens à votre fichier .dsp.

Ceci devrait créer une version DLL de votre module. Il vous suffit maintenant de l'enregistrer dans le répertoire `modules` à la racine de votre serveur, et d'utiliser la directive `LoadModule` pour la charger.

## Directives

- [[13-directives/loadfile|LoadFile]]
- [[13-directives/loadmodule|LoadModule]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
