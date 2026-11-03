---
title: "IndexOrderDefault"
description: "Directive Apache IndexOrderDefault (mod_autoindex) — Définit l'ordre d'affichage par défaut d'un index de répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit l'ordre d'affichage par défaut d'un index de répertoire |
| **Syntaxe** | `IndexOrderDefault Ascending\|Descending Name\|Date\|Size\|Description` |
| **Valeur par défaut** | `IndexOrderDefault Ascending Name` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `IndexOrderDefault` s'utilise en combinaison avec l'option d'index `FancyIndexing`. Par défaut, les index de répertoires "améliorés" sont affichés selon l'ordre croissant des noms de fichiers ; la directive `IndexOrderDefault` vous permet de modifier ce comportement.

La directive `IndexOrderDefault` accepte deux arguments. Le premier est soit `Ascending`, soit `Descending`, et indique l'ordre de tri. Le second doit prendre une des valeurs `Name`, `Date`, `Size`, ou `Description`, et permet d'identifier la clé primaire. La clé secondaire est *toujours* le nom du fichier selon un ordre croissant.

Si vous le désirez, vous pouvez empêcher le client de modifier l'ordre de tri de la liste en ajoutant l'option d'index `SuppressColumnSorting` qui supprime le lien de définition du tri de l'en-tête de la colonne, ainsi que l'option `IgnoreClient` qui empêche ce même client de passer outre vos préférences de tri en ajoutant manuellement des options de tri à la chaîne de paramètres de la requête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
