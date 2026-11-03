---
title: "MaxRanges"
description: "Directive Apache MaxRanges (core) — Nombre de segments de données autorisé avant le renvoi de l'intégralité de la ressource. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de segments de données autorisé avant le renvoi de l'intégralité de la ressource |
| **Syntaxe** | `MaxRanges default \| unlimited \| none \| nombre de segments` |
| **Valeur par défaut** | `MaxRanges 200` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible depuis la version 2.3.15 du serveur HTTP Apache |

## Utilisation

La directive `MaxRanges` permet de limiter le nombre de segments de données que le serveur va renvoyer au client. Si un nombre de segments plus important est demandé, la ressource sera renvoyée dans son intégralité.

**default**

Limite le nombre de segments de données à 200 (valeur par défaut définie à la compilation).

**none**

Les en-têtes Range sont ignorés.

**unlimited**

Le nombre de segments de données est illimité.

***nombre de segments***

Un nombre positif représentera la nombre de segments de données maximal que le serveur renverra au client.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
