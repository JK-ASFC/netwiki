---
title: "FilterTrace"
description: "Directive Apache FilterTrace (mod_filter) — Obtention d'informations de débogage/diagnostique en provenance de mod_filter. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Obtention d'informations de débogage/diagnostique en provenance de [[12-modules/mod_filter\|mod_filter]] |
| **Syntaxe** | `FilterTrace nom_filtre niveau` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_filter\|mod_filter]] |

## Utilisation

Cette directive permet d'obtenir des informations de débogage en provenance de [[12-modules/mod_filter|mod_filter]]. Elle est conçue pour aider à tester et déboguer les fournisseurs (ou modules de filtrage) ; elle peut aussi apporter une aide à l'utilisation de [[12-modules/mod_filter|mod_filter]] lui-même.

La sortie de débogage dépend de la définition d'argument *level* :

**`0` (valeur par défaut)**

Aucune information de débogage n'est générée.

**`1`**

[[12-modules/mod_filter|mod_filter]] va enregistrer les ensembles de conteneurs de données (buckets and brigades) qui traversent le filtre dans le journal des erreurs, avant que le fournisseur ne les traite. Ces informations sont similaires à celles générées par [mod\_diagnostics](http://apache.webthing.com/mod_diagnostics/).

**`2` (pas encore implémenté)**

Ce niveau permettra d'enregistrer l'ensemble des données qui traversent le filtre dans un fichier temporaire avant de les envoyer au fournisseur. **Pour un débogage mono-utilisateur seulement** ; l'enregistrement des données concernant plusieurs requêtes simultannées ne sera pas supporté.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
