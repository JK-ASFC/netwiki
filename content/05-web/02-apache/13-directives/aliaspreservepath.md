---
title: "AliasPreservePath"
description: "Directive Apache AliasPreservePath (mod_alias) — Associer le chemin entier à l'alias dans une section location. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associer le chemin entier à l'alias dans une section location. |
| **Syntaxe** | `AliasPreservePath OFF\|ON` |
| **Valeur par défaut** | `AliasPreservePath OFF` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache. |

## Utilisation

Lorsqu'on utilise la version à deux paramètres de la directive `Alias`, le chemin complet après l'alias est préservé. Lorsqu'on utilise la version à un paramètre de la directive `Alias` dans une section `<Location>`, le chemin entier est supprimé, et tous les URLs sont associés à l'expression cible.

Pour que la version à un paramètre de la directive `Alias` préserve les chemins de la même façon que la version à deux paramètres, activez cette directive.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
