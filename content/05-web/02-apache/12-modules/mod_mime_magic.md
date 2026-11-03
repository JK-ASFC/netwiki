---
title: "mod_mime_magic"
description: "Module Apache mod_mime_magic — Détermine le type MIME d'un fichier à partir de quelques octets de son contenu. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_mime_magic]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine le type MIME d'un fichier à partir de quelques octets de son contenu |
| **Statut** | Extension |
| **Identificateur** | `mime_magic_module` |
| **Fichier source** | `mod_mime_magic.c` |

## Sommaire

Ce module permet de déterminer le type MIME des fichiers de la même manière que la commande Unix `file(1)`, à savoir en se basant sur les premiers octets du fichier. Il est conçu comme une "seconde ligne de défense" pour les cas où [[12-modules/mod_mime|mod_mime]] ne parvient pas à déterminer le type du fichier.

Ce module est dérivé d'une version libre de la commande Unix `file(1)` qui utilise des "nombres magiques" et autres marques distinctives issus du contenu du fichier pour essayer de déterminer le type de contenu. Ce module n'est activé que si le fichier magique est spécifié par la directive [[13-directives/mimemagicfile|MimeMagicFile]].

## Format du fichier magique

Le fichier contient du texte ASCII sur 4 à 5 colonnes. Les lignes vides sont autorisées mais ignorées. Toute ligne commençant par un dièse (`#`) est un commentaire. Les autres lignes sont interprétées en colonnes comme suit :

| Colonne | Description |
| --- | --- |
| 1 | numéro de l'octet à partir duquel la vérification débute "`>`" indique une dépendance par rapport à la dernière ligne non-"`>`" |
| 2 | type de donnée à rechercher  \| \| \| \| --- \| --- \| \| `byte` \| caractère unique \| \| `short` \| entier sur 16 bits selon l'ordre de la machine \| \| `long` \| entier sur 32 bits selon l'ordre de la machine \| \| `string` \| chaîne de taille choisie \| \| `date` \| date au format entier long (secondes depuis le temps Unix epoch/1970) \| \| `beshort` \| entier 16 bits big-endian \| \| `belong` \| entier 32 bits big-endian \| \| `bedate` \| date au format entier 32 bits big-endian \| \| `leshort` \| entier 16 bits little-endian \| \| `lelong` \| entier 32 bits little-endian \| \| `ledate` \| date au format entier 32 bits little-endian \| |
| `byte` | caractère unique |
| `short` | entier sur 16 bits selon l'ordre de la machine |
| `long` | entier sur 32 bits selon l'ordre de la machine |
| `string` | chaîne de taille choisie |
| `date` | date au format entier long (secondes depuis le temps Unix epoch/1970) |
| `beshort` | entier 16 bits big-endian |
| `belong` | entier 32 bits big-endian |
| `bedate` | date au format entier 32 bits big-endian |
| `leshort` | entier 16 bits little-endian |
| `lelong` | entier 32 bits little-endian |
| `ledate` | date au format entier 32 bits little-endian |
| 3 | contenu des données à rechercher |
| 4 | type MIME si correspondance |
| 5 | codage MIME si correspondance (optionnel) |

Par exemple, les lignes du fichier magique suivantes permettraient de reconnaître certains formats audio :

```
# Sun/NeXT audio data
0      string      .snd
>12    belong      1       audio/basic
>12    belong      2       audio/basic
>12    belong      3       audio/basic
>12    belong      4       audio/basic
>12    belong      5       audio/basic
>12    belong      6       audio/basic
>12    belong      7       audio/basic
>12    belong     23       audio/x-adpcm
```

Et celles-ci permettraient de reconnaître la différence entre les fichiers `*.doc` qui contiennent des documents Microsoft Word et les documents FrameMaker (ce sont des formats de fichiers incompatibles qui possèdent le même suffixe).

```
# Frame
0  string  \<MakerFile        application/x-frame
0  string  \<MIFFile          application/x-frame
0  string  \<MakerDictionary  application/x-frame
0  string  \<MakerScreenFon   application/x-frame
0  string  \<MML              application/x-frame
0  string  \<Book             application/x-frame
0  string  \<Maker            application/x-frame

# MS-Word
0  string  \376\067\0\043            application/msword
0  string  \320\317\021\340\241\261  application/msword
0  string  \333\245-\0\0\0           application/msword
```

Un champ optionnel codage MIME peut être ajouté dans la cinquième colonne. Par exemple, cette ligne permet de reconnaître les fichiers compressés par gzip et définissent le type de codage.

```
# gzip (GNU zip, à ne pas confondre avec
#       l'archiveur zip [Info-ZIP/PKWARE])

0  string  \037\213  application/octet-stream  x-gzip
```

## Problèmes liés aux performances

Ce module n'est pas fait pour tous les systèmes. Si votre système parvient à peine à supporter sa charge, ou si vous testez les performances d'un serveur web, il est déconseillé d'utiliser ce module car son fonctionnement a un prix en matière de ressources consommées.

Des efforts ont cependant été fournis pour améliorer les performances du code original de la commande `file(1)` en l'adaptant pour fonctionner sur un serveur web à forte charge. Il a été conçu pour un serveur sur lequel des milliers d'utilisateurs publient leurs propres documents, ce qui est probablement très courant sur un intranet. Il s'avère souvent bénéfique qu'un serveur puisse prendre des décisions plus pertinentes à propos du contenu d'un fichier que celles se basant sur le nom du fichier seul, ne serait-ce que pour diminuer le nombre d'appels du type "pourquoi ma page ne s'affiche-t-elle pas ?" survenant lorsque les utilisateurs nomment leurs fichiers incorrectement. Vous devez déterminer si la charge supplémentaire convient à votre environnement.

## Notes

Les notes suivantes s'appliquent au module [[12-modules/mod_mime_magic|mod_mime_magic]] et sont incluses ici pour conformité avec les restrictions de copyright des contributeurs qui requièrent de les accepter.

Note de traduction : ces informations de type légal ne sont pas traductibles

> [!NOTE]
> mod\_mime\_magic: MIME type lookup via file magic numbers
> Copyright (c) 1996-1997 Cisco Systems, Inc.
>
> This software was submitted by Cisco Systems to the Apache Group in July 1997. Future revisions and derivatives of this source code must acknowledge Cisco Systems as the original contributor of this module. All other licensing and usage conditions are those of the Apache Group.
>
> Some of this code is derived from the free version of the file command originally posted to comp.sources.unix. Copyright info for that program is included below as required.

> [!NOTE]
> - Copyright (c) Ian F. Darwin, 1987. Written by Ian F. Darwin.
>
> This software is not subject to any license of the American Telephone and Telegraph Company or of the Regents of the University of California.
>
> Permission is granted to anyone to use this software for any purpose on any computer system, and to alter it and redistribute it freely, subject to the following restrictions:
>
> 1. The author is not responsible for the consequences of use of this software, no matter how awful, even if they arise from flaws in it.
> 2. The origin of this software must not be misrepresented, either by explicit claim or by omission. Since few users ever read sources, credits must appear in the documentation.
> 3. Altered versions must be plainly marked as such, and must not be misrepresented as being the original software. Since few users ever read sources, credits must appear in the documentation.
> 4. This notice may not be removed or altered.

> [!NOTE]
> For compliance with Mr Darwin's terms: this has been very significantly modified from the free "file" command.
>
> - all-in-one file for compilation convenience when moving from one version of Apache to the next.
> - Memory allocation is done through the Apache API's pool structure.
> - All functions have had necessary Apache API request or server structures passed to them where necessary to call other Apache API routines. (*i.e.*, usually for logging, files, or memory allocation in itself or a called function.)
> - struct magic has been converted from an array to a single-ended linked list because it only grows one record at a time, it's only accessed sequentially, and the Apache API has no equivalent of `realloc()`.
> - Functions have been changed to get their parameters from the server configuration instead of globals. (It should be reentrant now but has not been tested in a threaded environment.)
> - Places where it used to print results to stdout now saves them in a list where they're used to set the MIME type in the Apache request record.
> - Command-line flags have been removed since they will never be used here.

## Directives

- [[13-directives/mimemagicfile|MimeMagicFile]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
