---
title: "MaxRangeOverlaps"
description: "Directive Apache MaxRangeOverlaps (core) — Nombre de chevauchements de segments de données autorisé (par exemple 100-200,150-300) avant le renvoi de la ressource complète. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de chevauchements de segments de données autorisé (par exemple `100-200,150-300`) avant le renvoi de la ressource complète |
| **Syntaxe** | `MaxRangeOverlaps default \| unlimited \| none \| nombre de chevauchements` |
| **Valeur par défaut** | `MaxRangeOverlaps 20` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible depuis la version 2.3.15 du serveur HTTP Apache |

## Utilisation

La directive `MaxRangeOverlaps` permet de limiter le nombre de chevauchements de segments de données HTTP autorisé par le serveur. Si le nombre de chevauchements de segments demandé est supérieur au nombre maximal autorisé, la ressource sera renvoyée dans son intégralité.

**default**

Limite le nombre de chevauchements de segments à la valeur par défaut 20 définie à la compilation.

**none**

Aucun chevauchement de segment n'est autorisé.

**unlimited**

Le nombre de chevauchements de segments est illimité.

***number-of-ranges***

Un nombre positif représente le nombre maximal de chevauchements de segments autorisé par le serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
