---
title: "mod_substitute"
description: "Module Apache mod_substitute — Effectue des opérations de recherche/remplacement sur les corps de réponses. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_substitute]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Effectue des opérations de recherche/remplacement sur les corps de réponses |
| **Statut** | Extension |
| **Identificateur** | `substitute_module` |
| **Fichier source** | `mod_substitute.c` |
| **Compatibilité** | Disponible depuis la version 2.2.7 du serveur HTTP Apache |

## Sommaire

[[12-modules/mod_substitute|mod_substitute]] fournit un mécanisme permettant d'effectuer des substitutions de chaînes fixes ou d'expressions rationnelles sur les corps de réponses.

## Directives

- [[13-directives/substitute|Substitute]]
- [[13-directives/substitutemaxlinelength|SubstituteMaxLineLength]]
- [[13-directives/substituteinheritbefore|SubstituteInheritBefore]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
