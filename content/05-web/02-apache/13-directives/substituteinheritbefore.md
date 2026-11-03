---
title: "SubstituteInheritBefore"
description: "Directive Apache SubstituteInheritBefore (mod_substitute) — Modifie l'ordre de fusion des modèles hérités. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_substitute]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Modifie l'ordre de fusion des modèles hérités |
| **Syntaxe** | `SubstituteInheritBefore on\|off` |
| **Valeur par défaut** | `SubstituteInheritBefore on` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_substitute\|mod_substitute]] |
| **Compatibilité** | Disponible à partir de la version 2.4.17 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir si l'on applique les modèles [[13-directives/substitute|Substitute]] hérités en premier (valeur `on`), ou après ceux du contexte courant (valeur `off`). La valeur de la directive `SubstituteInheritBefore` est elle-même héritée, et les contextes qui en héritent (ceux qui ne définissent pas explicitement leur propre directive `SubstituteInheritBefore`) appliqueront donc l'ordre de fusion défini le plus proche.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
