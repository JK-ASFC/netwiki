---
title: "mod_buffer"
description: "Module Apache mod_buffer — Support de la mise en tampon des requêtes. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_buffer]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support de la mise en tampon des requêtes |
| **Statut** | Extension |
| **Identificateur** | `buffer_module` |
| **Fichier source** | `mod_buffer.c` |
| **Compatibilité** | Disponible depuis les versions 2.3 et supérieures d'Apache |

## Sommaire

Ce module fournit la possibilité de mettre en tampon les piles des filtres en entrée et sortie.

Dans certaines situations, les générateurs de contenu créent des contenus composés de petits tronçons. Afin de permettre la réutilisation de la mémoire, les éléments de mémoire attribués aux tronçons ont toujours une taille de 8k, quelle que soit la taille du tronçon lui-même. Lorsqu'une requête génère de nombreux petits tronçons, une grande quantité de mémoire peut être mobilisée par le traitement de la requête, et une grande quantité de données transmises sans nécessité. Pour y remédier, l'utilisation d'un tampon rassemble la réponse en un nombre de tronçons le plus petit possible.

Lorsque httpd est utilisé comme frontal d'un générateur de contenu consommant beaucoup de ressources, la mise en tampon de la réponse peut permettre à ce dernier d'effectuer le traitement et de libérer les ressources plus ou moins rapidement, en fonction de la manière dont il a été conçu.

Le filtre de mise en tampon peut être ajouté aux piles des filtres en entrée ou en sortie, selon les besoins, à l'aide des directives [[13-directives/setinputfilter|SetInputFilter]], [[13-directives/setoutputfilter|SetOutputFilter]], [[13-directives/addoutputfilter|AddOutputFilter]] ou [[13-directives/addoutputfilterbytype|AddOutputFilterByType]].

**Utilisation d'un tampon avec mod\_include**

```apache
AddOutputFilterByType INCLUDES;BUFFER text/html
```

> [!WARNING]
> Les filtres de mise en tampon lisent la requête/réponse en RAM, puis la reconditionnent sous la forme d'un nombre d'éléments mémoire le plus petit possible, au prix d'une consommation de temps CPU. Lorsque la requête/réponse est déjà conditionnée de manière satisfaisante, sa mise en tampon pourrait s'avérer encore plus lente qu'en l'absence d'utilisation de tampon. C'est pourquoi ces filtres doivent être utilisés avec précautions, et seulement si nécessaire.

## Directives

- [[13-directives/buffersize|BufferSize]]

## Voir aussi

- [[11-guides/01-generalites/filtres|Les filtres]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
