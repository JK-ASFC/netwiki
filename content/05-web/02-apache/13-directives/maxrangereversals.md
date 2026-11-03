---
title: "MaxRangeReversals"
description: "Directive Apache MaxRangeReversals (core) — Nombre d'inversions d'ordre autorisé dans la spécification des segments de données (par exemple 100-200,50-70) avant le renvoi de la ressource complète. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre d'inversions d'ordre autorisé dans la spécification des segments de données (par exemple `100-200,50-70`) avant le renvoi de la ressource complète |
| **Syntaxe** | `MaxRangeReversals default \| unlimited \| none \| nombre d'inversions` |
| **Valeur par défaut** | `MaxRangeReversals 20` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible depuis la version 2.3.15 du serveur HTTP Apache |

## Utilisation

La directive `MaxRangeReversals` permet de limiter le nombre d'inversions d'ordre dans la spécification des segments de données HTTP autorisé par le serveur. Si le nombre d'inversions demandé est supérieur au nombre maximal autorisé, la ressource sera renvoyée dans son intégralité.

**default**

Limite le nombre d'inversions à la valeur par défaut 20 définie à la compilation.

**none**

Aucune inversion n'est autorisée.

**unlimited**

Le nombre d'inversions est illimité.

***number-of-ranges***

Un nombre positif représente le nombre maximal d'inversions autorisé par le serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
