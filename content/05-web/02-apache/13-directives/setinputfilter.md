---
title: "SetInputFilter"
description: "Directive Apache SetInputFilter (core) — Définit les filtres par lesquels vont passer les requêtes client et les données POST. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les filtres par lesquels vont passer les requêtes client et les données POST |
| **Syntaxe** | `SetInputFilter filtre[;filtre...]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `SetInputFilter` permet de définir le ou les filtres par lesquels vont passer les requêtes client et les données POST au moment où le serveur les reçoit. Cette définition vient en ajout à tout autre filtre défini en quelqu'endroit que ce soit, y compris via la directive [[13-directives/addinputfilter|AddInputFilter]].

Si la directive comporte plusieurs filtres, ils doivent être séparés par des points-virgules, et spécifiés selon l'ordre dans lequel vous souhaitez les voir agir sur les contenus.

## Voir aussi

- [[11-guides/01-generalites/filtres|Filtres]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
