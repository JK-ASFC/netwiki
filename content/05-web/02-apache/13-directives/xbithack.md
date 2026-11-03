---
title: "XBitHack"
description: "Directive Apache XBitHack (mod_include) — Interprète les directives SSI dans les fichiers dont le bit d'exécution est positionné. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Interprète les directives SSI dans les fichiers dont le bit d'exécution est positionné |
| **Syntaxe** | `XBitHack on\|off\|full` |
| **Valeur par défaut** | `XBitHack off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |

## Utilisation

La directive `XBitHack` permet de contrôler l'interprétation des documents html standards. Elle n'affecte que les fichiers dont le type MIME est `text/html`. `XBitHack` peut prendre les valeurs suivantes :

**`off`**

Aucun traitement particulier pour les fichiers exécutables.

**`on`**

Tout fichier `text/html` dont le bit d'exécution est positionné pour le propriétaire sera traité en tant que document html interprété par le serveur.

**`full`**

Identique à `on`, avec test du bit d'exécution pour le groupe. Si ce dernier est positionné, la date de `dernière modification` du fichier renvoyé est définie à la date de dernière modification du fichier. Dans le cas contraire, aucune date de dernière modification n'est renvoyée. Le positionnement de ce bit permet aux clients et aux mandataires de gérer la mise en cache du résultat de la requête.

> [!NOTE]
> **Note**
>
> Il est recommandé de n'utiliser l'option full que dans le cas où vous êtes certain que le bit d'exécution du groupe est non positionné pour les scripts SSI qui pourraient effectuer l'`#include` d'un programme CGI ou bien produire des sorties différentes à chaque accès (ou seraient susceptibles d'être modifiées au cours des requêtes ultérieures).
>
> Lorsqu'elle est définie à `on`, la directive [[13-directives/ssilastmodified|SSILastModified]] l'emporte sur la directive [[13-directives/xbithack|XBitHack]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
